import { create } from "zustand";
import { persist } from "zustand/middleware";

export const initialFiltersList = [
  {
    name: "Basic Filters",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts",
    status: false,
    link: "basicRules",
  },
  {
    name: "Fake News",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/fakenews-only/hosts",
    status: false,
    link: "fakeNewsRules",
  },
  {
    name: "Gambling",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/gambling-only/hosts",
    status: false,
    link: "gamblingRules",
  },
  {
    name: "Porn",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn-only/hosts",
    status: false,

    link: "pornRules",
  },
  {
    name: "Social",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/social-only/hosts",
    status: false,
    link: "socialRules",
  },
];

const useFilterStore = create(
  persist(
    (set) => ({
      globalFilterStatus: false,
      filtersList: initialFiltersList,

      toggleGlobalFilterStatus: async (status) => {
        set((state) => {
          chrome.runtime.sendMessage({
            type: "globalFilterStatus",
            payload: { status },
          });

          return {
            globalFilterStatus: status,
            filtersList: state.filtersList.map((filter, index) => {
              return status
                ? { ...filter, status: index === 0 }
                : { ...filter, status: false };
            }),
          };
        });
      },
      toggleFilterStatus: (name) => {
        set((state) => {
          const updatedFiltersList = state.filtersList.map((filter) => {
            return filter.name === name
              ? { ...filter, status: !filter.status }
              : filter;
          });

          const globalFilterStatus = updatedFiltersList.some(
            (filter) => filter.status
          );

          chrome.runtime.sendMessage({
            type: "filterStatus",
            payload: {
              filtersList: updatedFiltersList,
            },
          });

          return {
            filtersList: updatedFiltersList,
            globalFilterStatus: globalFilterStatus,
          };
        });
      },
    }),
    {
      name: "filter-storage",
      onRehydrateStorage: (state) => {
        console.log("hydration starts", state);

        return (state, error) => {
          if (error) {
            console.log("an error happened during hydration", error);
          } else {
            console.log("hydration finished", state);
          }
        };
      },
    }
  )
);

export default useFilterStore;
