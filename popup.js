const toggle = document.getElementById('toggle');
const teamInput = document.getElementById('teamId');

// Load settings
browser.storage.local.get(["autoOpen", "teamId"]).then((res) => {
  toggle.checked = res.autoOpen !== undefined ? res.autoOpen : true;
  teamInput.value = res.teamId || "";
});

// Save Toggle
toggle.addEventListener('change', (e) => {
  browser.storage.local.set({ autoOpen: e.target.checked });
});

// Save Team ID on blur (when user clicks away)
teamInput.addEventListener('blur', (e) => {
  // Simple cleanup: uppercase and trim
  const val = e.target.value.trim().toUpperCase();
  browser.storage.local.set({ teamId: val });
});