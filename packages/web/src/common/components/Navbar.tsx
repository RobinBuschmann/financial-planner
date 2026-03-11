import { useState } from "react";
import { Link } from "@tanstack/react-router";
import type { LinkProps } from "@tanstack/react-router";
import type { ReactNode } from "react";

type NavLinkProps = {
  to: LinkProps["to"];
  children: ReactNode;
};

export const NavLink = ({ to, children }: NavLinkProps) => (
  <li>
    <Link
      to={to}
      className="block py-2 md:py-0 text-gray-400 hover:text-white transition-colors"
    >
      {children}
    </Link>
  </li>
);

type NavbarProps = {
  title: string;
  children: ReactNode;
};

export const Navbar = ({ title, children }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4 py-3">
        <Link to="/" className="text-xl font-bold text-white whitespace-nowrap hover:text-gray-200 transition-colors">
          {title}
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
          aria-controls="navbar-menu"
          aria-expanded={menuOpen}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        <div
          id="navbar-menu"
          className={`${menuOpen ? "block" : "hidden"} w-full md:block md:w-auto`}
        >
          <ul className="flex flex-col md:flex-row md:space-x-6 mt-4 md:mt-0 text-sm font-medium">
            {children}
          </ul>
        </div>
      </div>
    </nav>
  );
};
