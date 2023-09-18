import basicRules from "./rules/basicRules.json";
import fakeNewsRules from "./rules/fakeNewsRules.json";
import gamblingRules from "./rules/gamblingRules.json";
import pornRules from "./rules/pornRules.json";
import socialRules from "./rules/socialRules.json";

const rulesMap = new Map();

rulesMap.set("basicRules", basicRules);
rulesMap.set("fakeNewsRules", fakeNewsRules);
rulesMap.set("gamblingRules", gamblingRules);
rulesMap.set("pornRules", pornRules);
rulesMap.set("socialRules", socialRules);

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { type, payload } = request;

  const dynamicRules = await chrome.declarativeNetRequest.getDynamicRules();
  const dynamicRulesIds = dynamicRules.map((rule) => rule.id);
  console.log(dynamicRulesIds);

  switch (type) {
    case "globalFilterStatus": {
      const { status } = payload;
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: dynamicRulesIds,
        addRules: status ? rulesMap.get("basicRules") : [],
      });
      break;
    }
    case "filterStatus": {
      const { filtersList } = payload;

      const activeFilters = filtersList
        .filter((filter) => filter.status)
        .map((filter) => filter.link);

      console.log(activeFilters);

      const rules = activeFilters.map((filter) => rulesMap.get(filter));
      console.log(rules, rules.flat());

      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: dynamicRulesIds,
        addRules: rules.flat(),
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
