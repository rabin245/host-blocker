import fs from "fs";
// import { create } from "zustand";
// import { subscribeWithSelector } from "zustand/middleware";
// import useFilterStore from "../state/filterState";

// const globalFilterStatus = useFilterStore((state) => state.globalFilterStatus);
// console.log("hello this is from background script");
// console.log("this is test", globalFilterStatus);

// const useStore = create(
//   subscribeWithSelector(() => ({
//     globalFilterStatus: false,
//   }))
// );

// const globalFilterStatus = useFilterStore.getState().globalFilterStatus;
// console.log("Global Filter Status", globalFilterStatus);

// const unsubscribe = useFilterStore.subscribe(
//   (state) => state, // Subscribe to all state changes
//   (newState, prevState) => {
//     console.log("State changed:", newState);
//     console.log("Previous state:", prevState);
//     // Handle state changes here, if needed
//   }
// {
//   fireImmediately: true,
// }
// );

// const pawStatus = useFilterStore.getState().globalFilterStatus;
// console.log("Paw Status", pawStatus);

// const unsub = useFilterStore.subscribe(
//   (state) => state.globalFilterStatus,
//   console.log
// );

// const unsub1 = useFilterStore.subscribe(
//   (state) => state.globalFilterStatus,
//   (newVal, old) => console.log(newVal, old)
// );

// unsub();
// unsub1();

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
