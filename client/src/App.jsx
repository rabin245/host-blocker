import { Outlet } from "react-router-dom";
import { BottomNavbar } from "./components/NavBar";
import useFilterStore, { useHydration } from "./state/filterState";
import { initialFiltersList } from "./state/filterState";
import { fetcher, useHostsLists } from "./hooks/useHostsLists";
import { useEffect } from "react";
import { preload } from "swr";

const urls = initialFiltersList.map((filter) => filter.url);
urls.forEach((url) => preload(url, fetcher));

function App() {
  const updateHostsList = useFilterStore((state) => state.updateHostsList);

  const { hydrated, isStoreSaved } = useHydration();

  const swrRequests = initialFiltersList.map((filter) =>
    useHostsLists(filter.url)
  );

  useEffect(() => {
    const fetchAndUpdateStore = async () => {
      const isFirstLaunch = !(await isStoreSaved());

      console.log("hydrated state", hydrated, isFirstLaunch);

      const areAnyRequestsValidating = swrRequests.some(
        (request) => request.isValidating
      );

      if (isFirstLaunch || (hydrated && !areAnyRequestsValidating)) {
        swrRequests.forEach((request, index) => {
          updateHostsList(
            initialFiltersList[index].name,
            request.date,
            request.hosts
          );
        });
      }
    };

    fetchAndUpdateStore();
  }, [hydrated, swrRequests, updateHostsList]);

  return (
    <>
      <Outlet />
      <BottomNavbar />
    </>
  );
}

export default App;
