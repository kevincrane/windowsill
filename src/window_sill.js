import * as storage from "./storage.js";

const WINDOW_PREFIX = "🪟";


/**
 * Returns true if url is "privileged", as defined here:
 * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/tabs/create
 * @param url string
 */
function isPrivilegedUrl(url) {
    let privilegedPrefixes = [
        "chrome:",
        "javascript:",
        "data:",
        "file:",
        // "moz-extension:",
        "about:",
    ]
    return privilegedPrefixes.some(prefix => url.toLowerCase().startsWith(prefix));
}


/**
 * Return Promise of Arrays of current tabs in this window
 * @returns {Promise<string[]>} as a list of URLs on the sill, in order
 */
function getTabsOnSill(withIds=false) {
    return storage.getWindowSillId().then(windowSillId => {
        console.log("getTabsOnSill: getting tabs for window ID " + windowSillId);
        if (windowSillId < 0) {
            return [];
        }

        // Check windowSillId for which tabs it has open; empty Array if non-existent
        return browser.tabs.query({windowId: windowSillId}).then(tabs => {
            return tabs.map(tab => {
                if (withIds) {
                    return {id: tab.id, url: tab.url}
                } else {
                    return tab.url;
                }
            });
        }).catch(() => []);
    });
}

/**
 * Get the local tabs on the WindowSill and save them to synced storage
 * @returns {Promise<void>}
 */
function syncLocalTabsToStorage() {
    return getTabsOnSill().then(tabs => {
        let syncTabs = tabs.filter(url => !isPrivilegedUrl(url));
        if (syncTabs.length > 0) {
            storage.setSyncedTabs(syncTabs).then(() => {
                console.log('syncLocalTabsToStorage: Saved synced sillState');
            });
        }
    });
}

/**
 * Given two Arrays of Strings, containing URLs from local and synced state, open and close tabs on the local WindowSill
 * to match the synced state.
 */
function diffTabs(localTabs, syncedTabs, windowSillId) {
    let tabsAndIdsToClose = localTabs.filter(tab => !syncedTabs.includes(tab.url));
    let tabsToClose = tabsAndIdsToClose.map(tab => tab.url);
    let tabsToOpen = syncedTabs.filter(tab => !localTabs.some(localTab => localTab.url === tab));

    // Open and close tabs on the sill to match synced state
    tabsToOpen.forEach(tabToOpen => {
        browser.tabs.create({
            url: tabToOpen,
            windowId: windowSillId,
            active: false
        })
    })
    browser.tabs.remove(tabsAndIdsToClose.map(tab => tab.id));

    // Log the tabs opened and closed
    if (tabsToOpen.length > 0 || tabsAndIdsToClose.length > 0) {
        storage.addToActivityLog(tabsToOpen, tabsToClose);
    }
    console.log(`diffTabs: opening '${tabsToOpen}'`);
    console.log(`diffTabs: closing '${tabsToClose}'`);
}


// ##### Exported functions #####

/**
 * Synchronize the WindowSill tabs.
 *
 * If the local Sill is newer than the synced version, write local tabs to synced storage
 * If the synced version is newer, open and close tabs on the Sill to match that
 * @returns {Promise<void>}
 */
export const syncTabs = () => {
    return storage.getWindowSillId().then(windowSillId => {
        browser.windows.get(windowSillId).then(() => {
            storage.getLastSyncTime().then(lastSyncTime => {
                storage.getSyncedSillState().then(syncedState => {
                    if (lastSyncTime < syncedState.syncTime) {
                        // Synced state is newer; update local Window Sill
                        console.log("syncTabs: downloading and matching synced tabs");
                        return getTabsOnSill(true).then(localTabs => {
                            diffTabs(localTabs, syncedState.syncTabs, windowSillId);
                        });
                    } else {
                        // Local state is newer; send local tabs to synced storage
                        console.log("syncTabs: updating synced version of local tabs");
                        return syncLocalTabsToStorage();
                    }
                }).then(() => {
                    return storage.setLastSyncTime();
                });
            });
        }).catch(() => console.log(`syncTabs: window ${windowSillId} is not open; skipping sync`));
    });
}


/**
 * Focus on window with ID windowSillId set locally; if not set, opens new window and sets windowSillId
 */
export const focusWindowSill = () => {
    return storage.getWindowSillId().then(windowSillId => {
        browser.windows.get(windowSillId).then(() => {
            // Focus on already-open WindowSill
            browser.windows.update(windowSillId, {focused: true}).then(() =>
                console.log(`focusWindowSill: Focused on WindowSill id ${windowSillId}`));
        }).catch(() => {
            // Open new window if this window Id doesn't exist
            return storage.getSyncedSillState().then(syncedState => {
                browser.windows.create({
                    titlePreface: WINDOW_PREFIX,
                    url: syncedState.syncTabs.filter(url => !isPrivilegedUrl(url))
                }).then(window => {
                    storage.setWindowSillId(window.id).then(() => storage.setLastSyncTime().then(() => {
                        console.log(`focusWindowSill: Opened new windowSill with id: ${window.id}`);
                    }));
                });
            });
        });

        // seedSyncedState();

        return windowSillId;
    });
}

// TODO: delete this before publishing
function seedSyncedState() {
    let syncTime = new Date();
    let sillState = {
        syncTime: syncTime,
        syncTabs: [
            "https://www.nytimes.com/",
            "https://news.ycombinator.com/",
            "https://twitter.com/",
            "about:newtab"
        ].filter(url => !isPrivilegedUrl(url))
    }

    browser.storage.local.set(sillState).then(() => {
        console.log('seedSyncedState: Seeded synced sillState');
        console.log(sillState);
    });
}
