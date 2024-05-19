import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { Button } from "./ui/button";
import {
  fetchFollowUser,
  fetchGetFollow,
  resetFollow,
} from "@/features/UserFollowSlice";

function Profile({ user = {} }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    id,
    profile_image,
    user_name,
    first_name,
    last_name,
    followers = [],
    following = [],
    total_posts,
  } = user;

  const userInfo = useSelector((state) => state.user.userInfo);
  const follow = useSelector((state) => state.userFollow.follow);
  const userFollowing =
    useSelector((state) => state.userFollow.getFollow.following) || [];
  const followStatus = useSelector((state) => state.userFollow.followStatus);

  useEffect(() => {
    if (followStatus === "succeeded") {
      dispatch(fetchGetFollow(userInfo.id));
      alert(follow.massage);
      dispatch(resetFollow());
    }
  }, [followStatus, dispatch]);

  const handleLike = (id) => {
    if (userInfo) {
      dispatch(fetchFollowUser(id));
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="w-[96%] md:w-[80%] lg:w-[70%] mx-auto mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div className="flex space-x-2">
              <Avatar>
                <AvatarImage src={profile_image} />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
              <h3 className="text-base md:text-lg font-semibold mt-2">
                {user_name}
              </h3>
            </div>
            {id === userInfo.id ? null : (
              <Button
                className="text-xs md:text-sm"
                size="sm"
                variant={userFollowing.includes(id) ? "secondary" : "default"}
                onClick={() => handleLike(id)}
              >
                {userFollowing.includes(id)
                  ? "Unfollow"
                  : followStatus === "loading"
                  ? "loading"
                  : "Follow"}
              </Button>
            )}
          </CardTitle>
          <CardDescription className="text-center">
            {first_name} {last_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3">
            <div>
              <p className="text-lg md:text-xl font-semibold mt-2 text-center">
                Followers
              </p>
              <p className="text-center">{followers.length}</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-semibold mt-2 text-center">
                Following
              </p>
              <p className="text-center">{following.length}</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-semibold mt-2 text-center">
                Post
              </p>
              <p className="text-center">{total_posts}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-lg md:text-xl font-semibold">Posts</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Profile;
