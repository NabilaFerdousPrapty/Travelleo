

import { useState } from "react";

import { GiTireIronCross } from "react-icons/gi";

import { Link, NavLink } from "react-router";
import UseAuth from './../../hooks/UseAuth/UseAuth';
import Dropdown from './../../components/Dropdown';
import UseAdmin from "../../hooks/UseAdmin/UseAdmin";


function Navbar() {
  const {user ,loading}= UseAuth();
  

  const defaultLinks = [
    {
      route: "/",
      name: "Home",
      badgeCount: 0,
    },
    {
      route: "/about",
      name: "About",
      badgeCount: 0,
    },
    {
      route: "/pricing",
      name: "Pricing",
      badgeCount: 0,
    },
    {
      route: "/contact",
      name: "Contact",
      badgeCount: 0,
    },
  ];

  const [isAdmin, isAdminLoading] = UseAdmin();
  const links = user
    ? [
      ...defaultLinks,
      {
        route: isAdmin ? "/dashboard/admin" : "/dashboard",
        name: isAdminLoading ? "Loading..." : "Dashboard",
        badgeCount: 0,
      },
    ]
    : defaultLinks;

  const [menu, setMenu] = useState(false);
  const toggleMenu = () => setMenu(!menu);

  return (
    <div className="fixed top-0 w-full z-50 max-w-6xl mx-auto">
      {/* DESKTOP */}

      <div className="hidden lg:block animate-in fade-in zoom-in bg-slate-50 py-2 px-4 rounded-full mt-5 shadow-2xl">
        <div className="flex justify-between mx-4 items-center">
          <img
            className="h-14 w-auto"
            src="https://i.ibb.co.com/f1fwPSh/travelleo.png"
            alt=""
          />
          <div className="flex gap-[20px] xl:gap-[50px] text-[18px] items-center select-none">
            {links.map((item, index) => (
              <div key={index} className="flex gap-2">
                <NavLink
                  to={item.route}
                  className={({ isActive }) =>
                    isActive
                      ? "relative rounded-2xl px-5 py-2 overflow-hidden group bg-[#00053d] relative hover:bg-gradient-to-r hover:from-[#00053d] hover:to-[#00053d9c] text-white hover:ring-2 hover:ring-offset-2 hover:ring-[#00053d] transition-all ease-out duration-300"
                      : "hover:text-[#1e40af] cursor-pointer flex items-center gap-2 font-[500] text-gray"
                  }
                >
                  <p>{item.name}</p>
                </NavLink>

                {item.badgeCount ? (
                  <div className="h-8 w-8 rounded-full bg-primary flex justify-center items-center font-semibold text-white">
                    {item.badgeCount}
                  </div>
                ) : (
                  <div />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between lg:gap-[20px] select-none">
            {user ? (
              <>
                <div className="relative  text-xl"></div>
                <Dropdown />
              </>
            ) : (
              <>
                <Link to="/login">
                  <button
                    text="Sign in"
                    width="contain"
                    className="bg-white border text-[#31373D] border-[#EDEEF0] hover:bg-white"
                  />
                </Link>
                <Link to="/signUp">
                  <button text="Start for free" width="contain" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE */}
      <div
        className={`block text lg:hidden shadow-sm fixed top-0 w-full z-[999] bg-white py-4 animate-in fade-in zoom-in ${
          menu ? "bg-primary py-2" : ""
        }`}
      >
        <div className="flex justify-between mx-[10px]">
          <Link to="/">
            <img
              className="h-8 md:h-12 w-auto"
              src="https://i.ibb.co.com/9ncLQzX/newlogo-removebg-preview.png"
              alt=""
            />
          </Link>
          <div className="flex items-center gap-[40px]">
            {menu ? (
              <GiTireIronCross
                className="cursor-pointer text-black"
                onClick={toggleMenu}
              />
            ) : (
              <img
                src="https://i.ibb.co.com/55qdSRv/icons8-hamburger-menu-48.png"
                alt="logo"
                className="cursor-pointer"
                onClick={toggleMenu}
              />
            )}
          </div>
        </div>
        {menu && (
          <div className="my-4 select-none animate-in slide-in-from-right">
            <div className="flex flex-col items-center justify-center gap-8 mt-8 mx-4">
              {links.map((item, index) => (
                <div key={index} className="flex gap-2 ">
                  <NavLink
                    to={item.route}
                    className={({ isActive }) =>
                      isActive
                        ? "bg-[#F1F5F9] text-primary font-[500] p-1 rounded-lg flex items-center justify-center"
                        : "hover:text-primary cursor-pointer flex items-center justify-center gap-2 font-[500] text-gray"
                    }
                  >
                    <p>{item.name}</p>
                  </NavLink>
                  {item.badgeCount ? (
                    <div className="h-8 w-8 rounded-full bg-primary flex justify-center items-center font-semibold text-white">
                      {item.badgeCount}
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-[20px]">
                {user ? (
                  <div className="relative">
                    <Dropdown />
                  </div>
                ) : (
                  <>
                    <Link to="/login">
                      <button
                        text="Sign in"
                        width="contain"
                        className="bg-white border text-[#31373D] border-[#EDEEF0] hover:bg-white"
                      />
                    </Link>
                    <Link to="/signUp">
                      <button text="Start for free" width="contain" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;