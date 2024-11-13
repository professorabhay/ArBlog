import React, { useState } from "react";
import { Container, Logo } from "../index";
import { ConnectButton, useConnection } from "@arweave-wallet-kit/react";
import { Link, NavLink } from "react-router-dom";
import hamburgerIcon from "/icon-hamburger.svg";
import closeIcon from "/icon-close.svg";

function Header() {
  const [navOpen, setNavOpen] = useState(false);
  const { connected } = useConnection(); // Get connection status

  const closeNavbar = () => {
    setNavOpen(false);
  };

  const toggleNavbar = () => {
    setNavOpen(!navOpen);
  };

  const navItems = [
    { name: "Home", slug: "/" },
    { name: "All Posts", slug: "/posts" },
    { name: "Add Post", slug: "/add-post" },
  ];

  return (
    <header className="py-5 md:py-5 my-5 sticky top-0 z-50 px-0 md:px-10 bg-clip-padding">
      <Container>
        <nav className="flex justify-between flex-wrap items-center">
          <div>
            <Link to="/" onClick={closeNavbar}>
              <Logo width="100px" />
            </Link>
          </div>

          <div className="md:hidden mr-4">
            <button onClick={toggleNavbar}>
              <img src={navOpen ? closeIcon : hamburgerIcon} alt="" />
            </button>
          </div>

          <ul
            className={`ml-auto md:w-auto md:items-center md:flex-row md:flex border-red-600 ${
              navOpen ? "w-full flex flex-col items-center" : "hidden"
            }`}
          >
            {connected && // Render nav items if connected
              navItems.map((item) => (
                <li key={item.name} className="my-2 md:my-0">
                  <NavLink
                    onClick={closeNavbar}
                    to={item.slug}
                    className="inline-block px-6 py-2 duration-200 hover:text-gray-600"
                  >
                    {item.name}
                  </NavLink>
                </li>
              ))}
              <li className="my-4 md:my-0">
                <ConnectButton
                  onClick={closeNavbar}
                  className="md:ml-4 py-2 px-5 text-white button-custom rounded-xl shadow-sm hover:scale-105 duration-200 hover:cursor-pointer bg-customYellow hover:bg-white hover:text-black"
                  profileModal={true}
                  showBalance={false}
                  showProfilePicture={true}
                />
              </li>
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export default Header;
