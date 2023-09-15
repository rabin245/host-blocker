const basicRules = [
  {
    id: 1,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: "facebook.com",
      resourceTypes: ["main_frame"],
    },
  },
];

const fakeNewsRules = [
  {
    id: 2,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: "twitter.com",
      resourceTypes: ["main_frame"],
    },
  },
];

const gamblingRules = [
  {
    id: 3,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: "instagram.com",
      resourceTypes: ["main_frame"],
    },
  },
];

const pornRules = [
  {
    id: 4,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: "whatsapp.com",
      resourceTypes: ["main_frame"],
    },
  },
];

const socialRules = [
  {
    id: 5,
    priority: 1,
    action: { type: "block" },
    condition: {
      urlFilter: "linkedin.com",
      resourceTypes: ["main_frame"],
    },
  },
];

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
