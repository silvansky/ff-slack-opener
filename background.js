let settings = {
  autoOpen: true,
  teamId: "" // Default empty
};

// 1. Initialize Settings
function loadSettings() {
  browser.storage.local.get(["autoOpen", "teamId"]).then((result) => {
    if (result.autoOpen !== undefined) settings.autoOpen = result.autoOpen;
    if (result.teamId !== undefined) settings.teamId = result.teamId;
  });
}
loadSettings();

// 2. Listen for changes
browser.storage.onChanged.addListener((changes, area) => {
  if (area === "local") {
    if (changes.autoOpen) settings.autoOpen = changes.autoOpen.newValue;
    if (changes.teamId) settings.teamId = changes.teamId.newValue;
  }
});

// 3. Logic to construct the official Deep Link
function getSlackDeepLink(url) {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    const searchParams = urlObj.searchParams; // NEW: Access query parameters

    // MATCH: /archives/CHANNEL_ID/MESSAGE_ID
    // Example: /archives/C12345/p167890000000
    const match = path.match(/\/archives\/([A-Z0-9]+)(?:\/(p[0-9]+))?/);

    if (match) {
      const channelId = match[1];
      const rawMsgId = match[2]; // "p167..."
      const threadTs = searchParams.get('thread_ts'); // NEW: Extract thread timestamp

      // If we have a Team ID configured, use the robust 'slack://channel' scheme
      if (settings.teamId) {
        let deepLink = `slack://channel?team=${settings.teamId}&id=${channelId}`;
        
        // Handle Message Timestamp (The specific reply or message)
        if (rawMsgId) {
          const numericPart = rawMsgId.substring(1); // Remove 'p'
          let ts = numericPart;
          
          // Slack App requires the dot notation (12345.6789)
          if (numericPart.length > 6) {
            ts = numericPart.slice(0, -6) + "." + numericPart.slice(-6);
          }
          
          deepLink += `&message=${ts}`;
        }

        // NEW: Handle Thread Context
        // If this exists, it tells Slack to open the Thread Sidebar
        if (threadTs) {
          deepLink += `&thread_ts=${threadTs}`;
        }

        return deepLink;
      } else {
        console.error("No Team ID set in extension settings.");
      }
    }
  } catch (e) {
    console.error("Slack Opener Error:", e);
  }

  // Fallback: Return the original URL (signaling no change)
  return url;
}

// 4. Context Menu
browser.contextMenus.create({
  id: "open-in-slack",
  title: "Open in Slack App",
  contexts: ["link"],
  targetUrlPatterns: ["*://*.slack.com/archives/*"]
}, () => { if(browser.runtime.lastError) console.log("Menu exists"); });

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "open-in-slack") {
    const deepLink = getSlackDeepLink(info.linkUrl);
    // Only redirect if we actually generated a slack:// link
    if (deepLink.startsWith("slack://")) {
      browser.tabs.update(tab.id, { url: deepLink });
    }
  }
});

// 5. Automatic Interception
browser.webRequest.onBeforeRequest.addListener(
  (details) => {
    if (!settings.autoOpen || details.type !== "main_frame") return;
    if (details.url.startsWith("slack://")) return;

    const deepLink = getSlackDeepLink(details.url);

    // Safety: Only redirect if it is a different URL protocol (slack://)
    // If getSlackDeepLink returns the original http URL, ignore it to avoid loops.
    if (deepLink !== details.url && deepLink.startsWith("slack://")) {
        return { redirectUrl: deepLink };
    }
  },
  { urls: ["*://*.slack.com/archives/*"] },
  ["blocking"]
);
