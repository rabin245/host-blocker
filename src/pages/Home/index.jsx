import { Link } from "react-router-dom";
import "./styles.css";
import useFilterStore from "../../state/filterState";

const Home = () => {
  const globalFilter = useFilterStore((state) => state.globalFilter);
  const setGlobalFilterOn = useFilterStore((state) => state.setGlobalFilterOn);
  const setGlobalFilterOff = useFilterStore(
    (state) => state.setGlobalFilterOff
  );

  console.log(globalFilter);

  const handleToggle = () => {
    if (globalFilter === false) {
      setGlobalFilterOn();
    } else {
      setGlobalFilterOff();
    }
  };

  return (
    <>
      <div className="HomePage">
        <div className="Title">
          <h2>Home</h2>
        </div>
        <div className="Content">
          <h1>Not Protected</h1>
          <p>Tap on the swutch to enable protection</p>
          <Link to="/filter">
            <button>View Filters</button>
          </Link>
          <label className="switch">
            <input
              type="checkbox"
              checked={globalFilter}
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
