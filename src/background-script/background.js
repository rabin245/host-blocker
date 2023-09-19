chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { type, payload } = request;

  const enabledRulesets =
    await chrome.declarativeNetRequest.getEnabledRulesets();

  switch (type) {
    case "globalFilterStatus": {
      const { status } = payload;
      await chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: enabledRulesets,
        enableRulesetIds: status ? ["basicRules"] : [],
      });
      break;
    }
    case "filterStatus": {
      const { filter, status } = payload;

      await chrome.declarativeNetRequest.updateEnabledRulesets({
        disableRulesetIds: status ? [] : [filter],
        enableRulesetIds: status ? [filter] : [],
      });
      break;
    }
    default:
      break;
  }
});

chrome.declarativeNetRequest.onRuleMatchedDebug.addListener((e) => {
  const msg = `Navigation blocked to ${e.request.url} on tab ${e.request.tabId}.`;
  console.log(msg);
});

console.log("Service worker started.");
