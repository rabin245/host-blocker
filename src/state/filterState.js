import { create } from "zustand";

const initialFiltersList = [
  {
    name: "Basic Filters",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts",
    status: false,
  },
  {
    name: "Fake News",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/fakenews-only/hosts",
    status: false,
  },
  {
    name: "Gambling",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/gambling-only/hosts",
    status: false,
  },
  {
    name: "Porn",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/porn-only/hosts",
    status: false,
  },
  {
    name: "Social",
    url: "https://raw.githubusercontent.com/StevenBlack/hosts/master/alternates/social-only/hosts",
    status: false,
  },
];

const useFilterStore = create((set) => ({
  globalFilterStatus: false,
  filtersList: initialFiltersList,

  toggleGlobalFilterStatus: (status) =>
    set((state) => ({
      globalFilterStatus: status,
      filtersList: state.filtersList.map((filter, index) => {
        return status
          ? { ...filter, status: index === 0 }
          : { ...filter, status: false };
      }),
    })),
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

      return {
        filtersList: updatedFiltersList,
        globalFilterStatus: globalFilterStatus,
      };
    });
  },
}));

export default useFilterStore;
