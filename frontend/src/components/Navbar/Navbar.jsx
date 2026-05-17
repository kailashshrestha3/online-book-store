import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaGripLines } from "react-icons/fa";
import { useSelector } from "react-redux";

const Navbar = () => {
  const links = [
    {
      title: "Home",
      link: "/",
    },
    {
      title: "All Books",
      link: "/all-books",
    },
    {
      title: "Cart",
      link: "/cart",
    },
    {
      title: "Profile",
      link: "/profile",
    },
    {
      title: "Admin Profile",
      link: "/profile",
    },
  ];

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const role = useSelector((state) => state.auth.role);
  // console.log(isLoggedIn);

  if (isLoggedIn === false) {
    links.splice(2, 3);
  }

  if (isLoggedIn === true && role === "admin") {
    links.splice(3, 1);
  } else if (isLoggedIn === true && role === "user") {
    links.splice(4, 1);
  }

  const [mobileNav, setMobileNav] = useState("hidden");
  return (
    <>
      <nav className="z-50 relative flex bg-zinc-800 text-white px-8 py-2 items-center justify-between">
        <Link to="/" className="flex items-center">
          <img
            className="h-10 me-4"
            src="https://cdn-icons-png.flaticon.com/128/10433/10433049.png"
            alt="logo"
          />
          <h1 className="text-2xl font-semibold">BookHeaven</h1>
        </Link>
        <div className="block md:flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            {links.map((item, index) => (
              <div key={index} className="flex items-center">
                {item.title === "Profile" || item.title === "Admin Profile" ? (
                  <Link
                    to={item.link}
                    className="px-4 py-1 border border-blue-500 rounded-lg hover:bg-white transition-all hover:text-zinc-800 duration-300"
                    key={index}
                  >
                    {item.title}
                  </Link>
                ) : (
                  <Link
                    to={item.link}
                    className="hover:text-blue-500 transition-all duration-300"
                    key={index}
                  >
                    {item.title}{" "}
                  </Link>
                )}
              </div>
            ))}
          </div>
          <div className="hidden md:flex gap-4">
            {isLoggedIn === false && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-1 border border-blue-500 rounded-lg hover:bg-white transition-all hover:text-zinc-800 duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-1 bg-blue-500 rounded-lg hover:bg-white transition-all hover:text-zinc-800 duration-300"
                >
                  SignUp
                </Link>
              </>
            )}
          </div>
          <button
            className="md:hidden block text-white text-2xl hover:text-zinc-400"
            onClick={() =>
              setMobileNav(mobileNav === "hidden" ? "flex" : "hidden")
            }
          >
            <FaGripLines />
          </button>
        </div>
      </nav>
      <div
        className={`${mobileNav} bg-zinc-800 h-screen absolute top-0 left-0 w-full z-40 flex flex-col items-center justify-center`}
      >
        {links.map((item, index) => (
          <Link
            to={item.link}
            className={`${mobileNav} text-white text-4xl mt-8 font-semibold hover:text-blue-500 transition-all duration-300`}
            key={index}
            onClick={() =>
              setMobileNav(mobileNav === "hidden" ? "flex" : "hidden")
            }
          >
            {item.title}{" "}
          </Link>
        ))}
        {isLoggedIn === false && (
          <>
            <Link
              to="/login"
              className={`${mobileNav} px-8 py-2 text-3xl mb-8 mt-8 font-semibold 
              border border-blue-500 rounded-lg text-white hover:bg-white transition-all hover:text-zinc-800 duration-300`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`${mobileNav} px-8 py-2 text-3xl mb-8 font-semibold bg-blue-500 rounded-lg hover:bg-white transition-all hover:text-zinc-800 duration-300`}
            >
              SignUp
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Navbar;
