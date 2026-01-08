# Open in Slack App

A Firefox extension that automatically opens Slack web links in the native Slack desktop app using official deep link syntax.

## Features

- **Auto-redirect**: Automatically intercepts `*.slack.com/archives/*` links and opens them in the Slack app
- **Context menu**: Right-click any Slack link to open it in the app manually
- **Message linking**: Navigate directly to specific messages (requires Team ID)
- **Toggle on/off**: Easily enable or disable auto-opening from the popup

## Installation

### From GitHub Releases (Recommended)

1. Download the latest signed `.xpi` file from the [Releases page](https://github.com/silvansky/ff-slack-opener/releases)
2. In Firefox, go to `about:addons`
3. Click the gear icon → "Install Add-on From File..."
4. Select the downloaded `.xpi` file

### From Source (Temporary)

1. Clone or download this repository
2. Open Firefox and navigate to `about:debugging`
3. Click "This Firefox" in the sidebar
4. Click "Load Temporary Add-on..."
5. Select the `manifest.json` file from this directory

### From Source (Permanent)

1. Zip the extension files (`manifest.json`, `background.js`, `popup.html`, `popup.js`, `icons/`)
2. Rename the `.zip` to `.xpi`
3. In Firefox, go to `about:addons`
4. Click the gear icon → "Install Add-on From File..."
5. Select the `.xpi` file

> Note: Unsigned extensions require Firefox Developer Edition or Nightly with `xpinstall.signatures.required` set to `false` in `about:config`.

## Usage

1. Click the extension icon in your toolbar to open settings
2. **Enable Auto-Open**: Toggle automatic redirection on/off
3. **Team ID**: Enter your Slack workspace Team ID for message deep linking
   - Find it in your Slack URL: `app.slack.com/client/T0123ABC/...` (the `T0123ABC` part)

### How it works

When you click a Slack link like:
```
https://yourworkspace.slack.com/archives/C12345ABC/p1234567890123456
```

The extension converts it to:
```
slack://channel?team=T0123ABC&id=C12345ABC&message=1234567.890123
```

This opens the Slack app directly to that channel and message.

## Permissions

- `webRequest` / `webRequestBlocking`: Intercept and redirect Slack URLs
- `storage`: Save your settings (auto-open toggle, Team ID)
- `contextMenus`: Add "Open in Slack App" to right-click menu
- Host permissions for `*.slack.com`: Required to intercept Slack links

## License

MIT License - see [LICENSE](LICENSE)

