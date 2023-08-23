import { FiltersOptionCard } from "../../components/Cards";
import useFilterStore from "../../state/filterState";
import "./styles.css";

const Filters = () => {
  const setFilterOn = useFilterStore((state) => state.setFilterOn);
  const setFilterOff = useFilterStore((state) => state.setFilterOff);
  const basicFilter = useFilterStore((state) => state.basicFilter);
  const fakeNewsFilter = useFilterStore((state) => state.fakeNewsFilter);
  const gamblingFilter = useFilterStore((state) => state.gamblingFilter);
  const pornFilter = useFilterStore((state) => state.pornFilter);
  const socialFilter = useFilterStore((state) => state.socialFilter);

  const filters = [
    { title: "Basic Filters", name: "basicFilter", state: basicFilter },
    { title: "Fake News", name: "fakeNewsFilter", state: fakeNewsFilter },
    { title: "Gambling", name: "gamblingFilter", state: gamblingFilter },
    { title: "Porn", name: "pornFilter", state: pornFilter },
    { title: "Social", name: "socialFilter", state: socialFilter },
  ];

  const handleToggle = (name, state) => {
    if (state === false) {
      setFilterOn(name);
    } else {
      setFilterOff(name);
    }
  };

  console.log(
    "filters",
    basicFilter,
    fakeNewsFilter,
    gamblingFilter,
    pornFilter,
    socialFilter
  );

  return (
    <>
      <div className="FilterPage">
        <div className="Title">
          <h2>Filters</h2>
        </div>
        <div className="Content">
          {filters.map((filter, index) => (
            <FiltersOptionCard
              key={index}
              name={filter.name}
              title={filter.title}
              state={filter.state}
              handleToggle={handleToggle}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Filters;
