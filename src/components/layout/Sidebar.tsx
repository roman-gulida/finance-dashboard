import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <aside>
      <nav>
        <ul>
          <li>
            <NavLink to="/" end>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/transactions">Transactions</NavLink>
          </li>
          <li>
            <NavLink to="/budget">Budget</NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
