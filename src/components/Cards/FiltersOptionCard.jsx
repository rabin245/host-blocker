import { useEffect } from "react";
import { useHostsLists } from "../../hooks/useHostsLists";
import useFilterStore from "../../state/filterState";
import "./style.css";
export default function FiltersOptionCard({
  title,
  name,
  checked,
  handleToggle,
  url,
}) {
  const { date, hosts } = useHostsLists(url);

  const updateHostsList = useFilterStore((state) => state.updateHostsList);

  useEffect(() => {
    if (checked) {
      updateHostsList(name, date, hosts);
    }
  }, [checked, updateHostsList, hosts]);

  return (
    <div className="FilterOption">
      <p>{title}</p>
      <label className="switch">
        <input
          name={name}
          type="checkbox"
          checked={checked}
          onChange={() => handleToggle(name)}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
}
