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
            // let openedTabs = `<td><ul>${row.opened.map(tab => `<li><a href="${tab}">${tab}</a></li>`).join(' ')}</ul></td>\n`;
            // let closedTabs = `<td><ul>${row.closed.map(tab => `<li><a href="${tab}">${tab}</a></li>`).join(' ')}</ul></td>\n`;
            // let activityRow = `<tr>\n<td>${row.updateTime.toLocaleString("en-US")}</td>\n ${openedTabs} \n ${closedTabs} \n</tr>`;
            //
            let activityRow = createActivityRow(row.updateTime, row.opened, row.closed);
            document.getElementById("activity-log-contents").appendChild(activityRow);
        }
    })
});

/**
 * Given an updateTime (Date), list of tabs opened (Array[str]), and list of tabs closed (Array[str]), return a new HTML
 * element of type <tr> that can be appended to the table #activity-log-contents in activitylog.html.
 * @returns {HTMLTableRowElement}
 */
function createActivityRow(updateTime, opened, closed) {
    let activityRow = document.createElement("tr");

    let updateTimeCell = document.createElement("td");
    updateTimeCell.appendChild(document.createTextNode(updateTime.toLocaleString("en-US")));
    activityRow.appendChild(updateTimeCell);

    let openedCell = document.createElement("td");
    openedCell.appendChild(createListOfTabsCell(opened));
    activityRow.appendChild(openedCell);

    let closedCell = document.createElement("td");
    closedCell.appendChild(createListOfTabsCell(closed));
    activityRow.appendChild(closedCell);

    return activityRow;
}

/**
 * Given a list of tabs to either open or close, return a <ul> element with links to all tabs in the list
 * Example: <ul> <li> <a href={tab}>{tab}</a> </li> </ul>
 * @returns {HTMLUListElement}
 */
function createListOfTabsCell(tabs) {
    let listElement = document.createElement("ul");
    tabs.map(tab => {
        let listItem = document.createElement("li");
        let linkItem = document.createElement("a");
        linkItem.appendChild(document.createTextNode(tab));
        linkItem.href = tab;
        listItem.appendChild(linkItem);
        listElement.appendChild(listItem);
    });

    return listElement;
}
