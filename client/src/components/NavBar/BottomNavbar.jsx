import { Link } from "react-router-dom";
import "./styles.css";

const BottomNavbar = () => {
  return (
    <nav className="BottomNav">
      <Link to="/" className="NavItem">
        Home
      </Link>
      <Link to="/filter" className="NavItem">
        Filter
      </Link>
      <Link to="help" className="NavItem">
        help
      </Link>
      <Link to="settings" className="NavItem">
        settings
      </Link>
    </nav>
  );
};

export default BottomNavbar;
