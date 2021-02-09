import {focusWindowSill, syncTabs} from "../window_sill.js";

// Open Window Button
document.getElementById("open-window").addEventListener("click", () => {
    focusWindowSill().then(windowSillId => {
        console.log("windowSill: focused on window sill ID " + windowSillId);
    })
});

// Manual Sync Button
let syncButton = document.getElementById("sync-now");
syncButton.addEventListener("click", () => {
    syncTabs().then(() => {
        document.getElementById("sync-now").classList.add("success");
        console.log("windowSill: manually synced WindowSill tabs")
    });
});
document.addEventListener("DOMContentLoaded", () => {
    browser.storage.local.get({lastSyncTime: -1}).then(data => {
        let lastSyncDuration = "N/A";
        if (data.lastSyncTime >= 0) {
            let now = new Date();
            let durationHour = Math.floor((now - data.lastSyncTime) / (60 * 60 *1000));
            let durationMin = Math.floor((now - data.lastSyncTime) / (60*1000)) % 60;
            let durationSec = Math.floor((now - data.lastSyncTime) / 1000) % 60;
            lastSyncDuration = `${durationHour > 0 ? `${durationHour}:` : ``}` +
                `${durationMin.toString().padStart(2, '0')}:${durationSec.toString().padStart(2, '0')}`;
        }
        let syncSubtitle = document.createElement("div");
        syncSubtitle.appendChild(document.createTextNode(`Last updated: ${lastSyncDuration} ago`));
        syncSubtitle.classList.add("button-subtitle");
        syncButton.appendChild(syncSubtitle);
        console.log(syncButton.innerHTML);
    })
});

// Open Activity Log Button
document.getElementById("activity-log").addEventListener("click", () => {
    browser.tabs.create({url: "/src/activitylog/activitylog.html"}).then(() => console.log("windowSill: opened activity log"));
});
