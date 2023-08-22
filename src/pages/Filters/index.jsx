// import { Link } from "react-router-dom";
import { FiltersOptionCard } from "../../components/FiltersOptionCard";
import "./styles.css";

const Filters = () => {
  return (
    <>
      <div className="FilterPage">
        <div className="Title">
          <h2>Filters</h2>
        </div>
        <div className="Content">
          <FiltersOptionCard />
          <FiltersOptionCard />
        </div>
      </div>
    </>
  );
};

export default Filters;
