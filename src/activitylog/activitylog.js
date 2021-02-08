import * as storage from "../storage.js";

/**
 * Generate table of tabs opened and closed on each update from Synced -> Local WindowSill
 */
document.addEventListener("DOMContentLoaded", ev => {
    storage.getActivityLog().then(activityLog => {
        // sort in descending order by date
        activityLog.sort((a,b) => (b.updateTime - a.updateTime));

        // Iterate through each action taken in activityLog; has keys [opened, closed, updateTime]
        for (let row of activityLog) {
            // Build and append table cells for opened and closed tabs
            let openedTabs = `<td><ul>${row.opened.map(tab => `<li><a href="${tab}">${tab}</a></li>`).join(' ')}</ul></td>\n`;
            let closedTabs = `<td><ul>${row.closed.map(tab => `<li><a href="${tab}">${tab}</a></li>`).join(' ')}</ul></td>\n`;
            let activityRow = `<tr>\n<td>${row.updateTime.toLocaleString("en-US")}</td>\n ${openedTabs} \n ${closedTabs} \n</tr>`;

            document.getElementById("activity-log-contents").innerHTML += activityRow;
        }
    })
});
