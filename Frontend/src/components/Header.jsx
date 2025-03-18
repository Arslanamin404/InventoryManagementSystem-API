import React, { useState, useEffect } from "react";
import {
  Navbar,
  Collapse,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { Package } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

function NavList() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Inventory", path: "/inventory" },
    { name: "Contact", path: "/contact" },
    { name: "About", path: "/about" },
    ...(user
      ? [
          { name: "Dashboard", path: "/dashboard" },
          { name: "Profile", path: "/profile" },
          { name: "Logout", path: "/" },
        ]
      : [{ name: "Login", path: "/login" }]),
  ];

  return (
    <ul className="flex flex-col md:gap-2 lg:flex-row lg:items-center lg:gap-6 md:mr-5">
      {navItems.map(({ name, path }, index) => (
        <Typography
          key={index}
          as="li"
          variant="paragraph"
          color="blue-gray"
          className="p-1 font-medium"
        >
          {name === "Logout" ? (
            <button
              onClick={handleLogout}
              disabled={loading}
              className="inline-flex h-10 w-full items-center justify-center rounded-md px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 bg-red-500"
            >
              Logout
            </button>
          ) : (
            <Link
              to={path}
              className="flex items-center text-gray-900 hover:text-blue-500 transition-colors"
            >
              {name}
            </Link>
          )}
        </Typography>
      ))}
    </ul>
  );
}

export const Header = () => {
  const [openNav, setOpenNav] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) {
        setOpenNav(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Navbar className=" w-full py-3 bg-gray-100 shadow-md px-5">
      <div className="flex items-center justify-between text-blue-gray-900">
        {/* Logo */}
        <div className="flex items-center justify-center">
          <Package className="text-gray-900 h-6 w-6 md:h-7 md:w-7" />
          <Typography
            as="div"
            variant="h6"
            className="mr-4 cursor-pointer py-1.5 text-gray-900 ml-2 font-extrabold text-xl tracking-wider "
          >
            <Link to={"/"}>IMS</Link>
          </Typography>
        </div>

        {/* Desktop Nav */}
        <div className="hidden lg:block">
          <NavList />
        </div>

        {/* Mobile Menu Toggle */}
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-slate-900 lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </IconButton>
      </div>

      {/* Mobile Menu */}
      <Collapse open={openNav} className="block lg:hidden">
        <div className="mt-2">
          <NavList />
        </div>
      </Collapse>
    </Navbar>
  );
};
