import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { fetchUserDetailsUnknown } from "@/features/UserSlice";

function ProfilePage() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const userDetailsUnknown =
    useSelector((state) => state.user.userDetailsUnknown) || {};
  const userDetailsUnknownStatus = useSelector(
    (state) => state.user.userDetailsUnknownStatus
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchUserDetailsUnknown(id));
    }
  }, [id, dispatch]);
  return (
    <>
      {userDetailsUnknownStatus === "loading" ||
      userDetailsUnknownStatus === "idle" ? (
        <p>Loading...</p>
      ) : userDetailsUnknownStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-center">Profile</h1>
          <div className="w-[96%] md:w-[80%] lg:w-[70%] mx-auto mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex flex-col justify-center space-y-2">
                  <Avatar className="mx-auto w-24 h-24">
                    <AvatarImage src={userDetailsUnknown.profile_image} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg md:text-xl font-semibold text-center">
                    {userDetailsUnknown.user_name}
                  </h3>
                </CardTitle>
                <CardDescription>
                  {userDetailsUnknown.first_name} {userDetailsUnknown.last_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3">
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mt-2">
                      Followers
                    </h3>
                    <p>{userDetailsUnknown.followers.length}</p>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mt-2">
                      Following
                    </h3>
                    <p>{userDetailsUnknown.following.length}</p>
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold mt-2">
                      Post
                    </h3>
                    <p>{userDetailsUnknown.followers.length}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <h3 className="text-lg md:text-xl font-semibold">Posts</h3>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </>
  );
}

export default ProfilePage;
