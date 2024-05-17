import React from "react";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Navigation from "./components/Navigation";
import { fetchUserDetails } from "./features/UserSlice";

function Layout() {
  const dispatch = useDispatch();

  const userInfo = useSelector((state) => state.user.userInfo);
  const userDetailsStatus = useSelector(
    (state) => state.user.userDetailsStatus
  );

  useEffect(() => {
    if (userInfo) {
      dispatch(fetchUserDetails(userInfo.id));
    }
  }, [userInfo, dispatch]);
  return (
    <>
      {userDetailsStatus === "loading" ? (
        <div>Loading...</div>
      ) : userDetailsStatus === "failed" ? (
        <div>Error</div>
      ) : (
        <>
          <Navigation />
          <div className="md:ml-[55px]">
            <Outlet />
          </div>
        </>
      )}
    </>
  );
}

export default Layout;
