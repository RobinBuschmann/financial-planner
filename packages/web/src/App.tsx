import { Outlet } from "@tanstack/react-router";
import { Navbar, NavLink } from "./common/components/Navbar.tsx";

export const App = () => (
  <div className="min-h-screen bg-muted/50">
    <Navbar title="Financial Planner">
      <NavLink to="/transactions">Transactions</NavLink>
      <NavLink to="/budgets">Budgets</NavLink>
    </Navbar>
    <Outlet />
  </div>
);
