import { Outlet } from "react-router-dom";
import { BottomNavbar } from "./components/NavBar";

function App() {
  return (
    <>
      <Outlet />
      <BottomNavbar />
    </>
  );
}

export default App;
