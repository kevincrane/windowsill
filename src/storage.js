
// Pointers to the 2 storage methods
const local_storage = browser.storage.local;
const sync_storage = browser.storage.sync;

const ACTIVITYLOG_LENGTH = 15;

/**
 * Get activityLog from local storage
 * @returns {Promise<[{closed: [string], opened: [string], updateTime: Date}]>}
 */
export function getActivityLog() {
    return local_storage.get({activityLog: []}).then(store => {
        return store.activityLog;
    });
}


/**
 * Add a new entry to the activityLog in local storage
 * @returns {Promise<void>}
 */
export function addToActivityLog(opened=[], closed=[]) {
    return getActivityLog().then(activityLog => {
        activityLog.push({
            opened: opened,
            closed: closed,
            updateTime: new Date()
        });
        while (activityLog.length > ACTIVITYLOG_LENGTH) {
            activityLog.shift();
        }
        return local_storage.set({activityLog: activityLog});
    });
}


/**
 * Return windowSillId from local storage, or -1 if not found
 * @returns {Promise<number>}
 */
export function getWindowSillId() {
    return browser.storage.local.get({windowSillId: -1}).then(store => {
        return store.windowSillId;
    })
}

/**
 * Set windowSillId in local storage
 * @returns {Promise<void>}
 */
export function setWindowSillId(windowSillId) {
    return browser.storage.local.set({windowSillId: windowSillId});
}


/**
 * Returns lastUpdateTime (last time tabs synced locally) from local storage, or Date(0) if not found
 * @returns {Promise<Date>}
 */
export function getLastSyncTime() {
    return browser.storage.local.get({lastSyncTime: new Date(0)}).then(store => {
        return store.lastSyncTime;
    });
}

/**
 * Set lastUpdateTime in local storage, or current Date() if not set
 * @returns {Promise<void>}
 */
export function setLastSyncTime(lastSyncTime=new Date()) {
    return browser.storage.local.set({lastSyncTime: lastSyncTime});
}


/**
 * Returns {syncTabs: [urls], syncTime: Date()} from synced storage.
 * @returns {Promise<{syncTabs: [string], syncTime: Date}>}
 */
export function getSyncedSillState() {
    return sync_storage.get({syncTabs: [], syncTime: new Date(0)});
}

/**
 * Set keys 'syncTabs' and 'syncTime' in synced storage, representing an Array of string URLs on the sill, and the last
 * Date() that we synced this state.
 * @returns {Promise<void>}
 */
export function setSyncedTabs(syncTabs=[]) {
    return sync_storage.set({syncTabs: syncTabs, syncTime: new Date()});
}
