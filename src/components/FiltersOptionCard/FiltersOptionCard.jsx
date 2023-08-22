import "./style.css";
export default function FiltersOptionCard() {
  return (
    <div className="FilterOption">
      <p>Basic Filters</p>
      <label className="switch">
        <input type="checkbox" />
        <span className="slider round"></span>
      </label>
    </div>
  );
}
