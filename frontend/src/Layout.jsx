import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";

function Layout() {
  return (
    <>
      <Navigation />
      <div className="md:ml-[55px]">
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
