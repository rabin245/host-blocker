import { Link } from "react-router-dom";
import "./styles.css";
// import { useEffect } from "react";
import { useHostsLists } from "../../hooks/useHostsLists";

const Home = () => {
  const res = useHostsLists(
    "https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts"
  );
  console.log(res);

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
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </>
  );
};

export default Home;
