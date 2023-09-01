import "./style.css";
export default function FiltersOptionCard({
  title,
  name,
  checked,
  handleToggle,
}) {
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
