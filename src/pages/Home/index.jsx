import { Link } from "react-router-dom";
import "./styles.css";
import useFilterStore from "../../state/filterState";

const Home = () => {
  const globalFilterStatus = useFilterStore(
    (state) => state.globalFilterStatus
  );
  const toggleGlobalFilterStatus = useFilterStore(
    (state) => state.toggleGlobalFilterStatus
  );

  const globalHostsList = useFilterStore((state) => state.globalHostsList);
  console.log(globalHostsList);

  const handleToggle = () => {
    if (globalFilterStatus) toggleGlobalFilterStatus(false);
    else toggleGlobalFilterStatus(true);
  };

  return (
    <>
      <div className="HomePage">
        {/* <div className="Title">
          <h2>Home</h2>
        </div> */}
        <div className="Content">
          <h1>Not Protected</h1>
          <p>Tap on the switch to enable protection</p>
          <Link to="/filter">
            <button>View Filters</button>
          </Link>
          <label className="switch">
            <input
              type="checkbox"
              checked={globalFilterStatus}
              onChange={handleToggle}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </>
  );
};

export default Home;
