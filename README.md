# Window Sill - Browser Extension

### Author: Kevin Crane

#### Description
Automatically synchronize browser tabs from one computer to your others. Just open the *Window Sill*,
and any tabs left there will open on other computers you are logged in to. Close the tab on one
browser, and it'll close on the others.

#### Usage

First, be sure you are logged in to an account with your browser. If you're using Firefox, you can
create an account [here](https://www.mozilla.org/en-US/firefox/accounts/). Without this, your tabs
can't be synced to the shared storage your browser account provides.

If you click the extension icon in the browser, you'll see 3 buttons.

1. **Open Window**: switch focus to the Window Sill; if not already open, creates a new Window Sill
   and opens all tabs that have been synced.
2. **Sync Now**: synchronizes all your tabs to the cloud. If there are new tabs on the Window Sill,
   placed there from a different computer, these will open now (or close tabs that have been closed
   on the other device). You don't have to always hit this button, your tabs should automatically
   sync every 5 minutes on their own. The time since the last synchronization will show in this
   button.
3. **Activity Log**: shows your tabs that have been opened or closed on previous synchronizations.
   I'm not perfect and neither is synchronized data storage, so if there are issues with your tabs
   (i.e. a bunch of tabs open or close without you expecting them to), this is where you would
   check to get the links to re-open.

Every tab title in the Window Sill be prefaced with 🪟. There can only be one Window Sill opened at
a time.

#### Known Issues & Limitations

* **Browsers supported**: tested on Firefox; supposedly every WebExtension API used is supported by
  every other major browser too though.
* There can only be one browser window designated as the Window Sill; the title of every tab on the
  Window Sill is prefaced with 🪟.
* **Bug**: if you close and re-open the browser, the window IDs will change, meaning the extension
  won't know which window is the Sill. Click the **Open Window** button in the extension popup to
  open a new one.

#### Privacy

**Q**: Are you going to look at all the tabs I open and synchronize to the cloud?

**A**: Nope, I don't have any access to your data. If you're logged in to an account with your
   browser, e.g. [Firefox Accounts](https://www.mozilla.org/en-US/firefox/accounts/), then they
   provide a small amount of storage space that is synchronized between other browsers you are
   logged on to, meaning I don't have to manage any storage myself (and therefore don't have any
   servers to even see your tabs).

#### Links to Download Extension

* [Firefox - Window Sill Extension](TODO)

#### How to Develop

1. Clone this repo
2. Source code is in `/src`, split into the following main pieces:
    1. `activitylog`: HTML/JS/CSS for the activity log
    2. `background`: defines the cron job for the background task that runs auto-syncs
    3. `popup`: HTML/JS/CSS for the buttons in the pop-up window from the toolbar icon
    4. `storage.js`: helpers for updating and fetching data in the local and synchronized storage
    5. `window_sill.js`: methods for actually running Window Sill; opens and focuses windows, syncs
       tabs between windows, etc.
3. On Firefox, go to [about:debugging](about:debugging#/runtime/this-firefox) > Load Temporary
   Add-on > select `manifest.json` from this repo
4. Open the Console with "Inspect" to see logging from this extension.
