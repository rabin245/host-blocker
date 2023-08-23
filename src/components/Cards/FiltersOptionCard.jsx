import "./style.css";
export default function FiltersOptionCard({
  title,
  name,
  state,
  handleToggle,
}) {
  return (
    <div className="FilterOption">
      <p>{title}</p>
      <label className="switch">
        <input
          name={name}
          type="checkbox"
          checked={state}
          onChange={() => handleToggle(name, state)}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
}
