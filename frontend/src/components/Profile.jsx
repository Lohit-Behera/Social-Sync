import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { fetchGetUserAllTextPost } from "@/features/TextPostSlice";
import { Loader2 } from "lucide-react";

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
  const getUserAllTextPostStatus = useSelector(
    (state) => state.textPost.getUserAllTextPostStatus
  );
  const getUserAllTextPost =
    useSelector((state) => state.textPost.getUserAllTextPost) || [];

  useEffect(() => {
    dispatch(fetchGetUserAllTextPost(id));
  }, [dispatch]);

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
      {getUserAllTextPostStatus === "loading" ? (
        <p>Loading...</p>
      ) : getUserAllTextPostStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between">
              <div className="flex space-x-2">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={profile_image} />
                  <AvatarFallback>P</AvatarFallback>
                </Avatar>
                <h3 className="text-base md:text-lg font-semibold mt-4">
                  {user_name}
                </h3>
              </div>
              {id === userInfo.id ? null : (
                <Button
                  className="text-xs md:text-sm mt-2.5"
                  size="sm"
                  variant={userFollowing.includes(id) ? "secondary" : "default"}
                  onClick={() => handleLike(id)}
                >
                  {userFollowing.includes(id) ? (
                    "Unfollow"
                  ) : followStatus === "loading" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> loading
                    </>
                  ) : (
                    "Follow"
                  )}
                </Button>
              )}
            </CardTitle>
            <CardDescription>
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
          <CardFooter className="flex flex-col">
            <p className="text-lg md:text-xl font-semibold text-center my-4">
              Posts
            </p>
            <div className="grid grid-cols-3 gap-2">
              {Array.isArray(getUserAllTextPost) &&
                getUserAllTextPost.map((post) => (
                  <Card key={post.id} className="bg-muted">
                    <CardHeader>
                      <CardTitle>
                        <Link to={`/post/${post.id}`}>
                          <p className="line-clamp-1 text-xs md:text-sm lg:text-base text-cent">
                            {post.content}
                          </p>
                        </Link>
                      </CardTitle>
                    </CardHeader>
                  </Card>
                ))}
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

export default Profile;
