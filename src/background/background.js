import {syncTabs} from "../window_sill.js";

// 5 minutes, in milliseconds
const UPDATE_INTERVAL = 5 * 60 * 1000;

setInterval(() => {
    console.log("WindowSill background: running syncTabs");
    syncTabs();
}, UPDATE_INTERVAL);
