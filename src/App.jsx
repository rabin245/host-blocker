import { Outlet } from "react-router-dom";
import { BottomNavbar } from "./components/NavBar";
import { preload } from "swr";
import useFilterStore from "./state/filterState";
import { initialFiltersList } from "./state/filterState";
import { fetcher, useHostsLists } from "./hooks/useHostsLists";

const urls = initialFiltersList.map((filter) => filter.url);

urls.forEach((url) => preload(url, fetcher));

function App() {
  const updateHostsList = useFilterStore((state) => state.updateHostsList);

  initialFiltersList.map((filter) => {
    const { date, hosts } = useHostsLists(filter.url);
    updateHostsList(filter.name, date, hosts);
  });

  return (
    <>
      <Outlet />
      <BottomNavbar />
    </>
  );
}

export default App;
