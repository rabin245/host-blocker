import { create } from "zustand";

const useFilterStore = create((set) => ({
  globalFilter: false,
  basicFilter: false,
  fakeNewsFilter: false,
  pornFilter: false,
  gamblingFilter: false,
  socialFilter: false,

  setGlobalFilterOn: () => {
    set({
      globalFilter: true,
      basicFilter: true,
      fakeNewsFilter: true,
      pornFilter: true,
      gamblingFilter: true,
      socialFilter: true,
    });
  },
  setGlobalFilterOff: () => {
    set({
      globalFilter: false,
      basicFilter: false,
      fakeNewsFilter: false,
      pornFilter: false,
      gamblingFilter: false,
      socialFilter: false,
    });
  },
  setFilterOn: (filter) => {
    set({ [filter]: true, globalFilter: true });
  },
  setFilterOff: (filter) => {
    set((state) => {
      const newState = { ...state, [filter]: false };
      if (
        !newState.basicFilter &&
        !newState.fakeNewsFilter &&
        !newState.pornFilter &&
        !newState.gamblingFilter &&
        !newState.socialFilter
      ) {
        newState.globalFilter = false;
      }

      return newState;
    });
  },
}));

export default useFilterStore;
