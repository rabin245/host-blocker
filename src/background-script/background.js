import fs from "fs";

console.log("hello this is from background script");

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
  const msg = `Navigation blocked to ${e.request.url} on tab ${e.request.tabId}.`;
  console.log(msg);
});

console.log("Service worker started.");

// const blockedHosts = ["google.com", "facebook.com"];

// chrome.declarativeNetRequest.onRequest.register(
//   { urls: ["*://*/*"] },
//   (details) => {
//     const { requestHeaders } = details;

//     for (const host of blockedHosts) {
//       if (requestHeaders.get("Host") === host) {
//         details.abort();
//         return;
//       }
//     }
//   }
// );
