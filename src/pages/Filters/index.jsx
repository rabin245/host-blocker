import { FiltersOptionCard } from "../../components/Cards";
import useFilterStore from "../../state/filterState";
import "./styles.css";

const Filters = () => {
  const filtersList = useFilterStore((state) => state.filtersList);
  const toggleFilterStatus = useFilterStore(
    (state) => state.toggleFilterStatus
  );

  console.log(filtersList.map((filter) => filter.status));

  const globalHostsList = useFilterStore((state) => state.globalHostsList);
  console.log(globalHostsList);

  return (
    <>
      <div className="FilterPage">
        <div className="Title">
          <h2>Filters</h2>
        </div>
        <div className="Content">
          {filtersList.map((filter, index) => (
            <FiltersOptionCard
              key={index}
              name={filter.name}
              title={filter.name}
              checked={filter.status}
              handleToggle={toggleFilterStatus}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Filters;
