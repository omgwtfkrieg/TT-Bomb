// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });


//example of using a message handler from the inject scripts
/* chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
  	chrome.pageAction.show(sender.tab.id);
    sendResponse();

  }); */
  
// Show page action icon in omnibar.
function onWebNav(details) {
    if (details.frameId === 0) {
        // Top-level frame
        chrome.pageAction.show(details.tabId);
    }
}
var filter = {
    url: [{
        hostEquals: 'http://km2.timetrak.com:85/'
    }]
};
chrome.webNavigation.onCommitted.addListener(onWebNav, filter);
chrome.webNavigation.onHistoryStateUpdated.addListener(onWebNav, filter);

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.sendRequest(tab.id, {method: "getLocalStorage"}, function(response) {
    var myObjectRetrieved = JSON.parse(response.data);
    console.log(myObjectRetrieved);
  });
});

/* chrome.storage.sync.get('badgeID_OP', function (result) {
console.log('getting Badge from the Option page ' + items.badgeID_OP);
send_badgeID_OP=items.badgeID_OP;
}); */

