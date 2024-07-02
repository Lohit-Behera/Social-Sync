import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchGetAllTextPost } from "@/features/PostSlice";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  fetchFollowUser,
  fetchGetFollow,
  resetFollow,
} from "@/features/UserFollowSlice";
import { Loader2, UserMinus, UserPlus } from "lucide-react";

function TextPostPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);
  const getAllTextPost = useSelector((state) => state.post.getAllTextPost);
  const getAllTextPostStatus = useSelector(
    (state) => state.post.getAllTextPostStatus
  );
  const follow = useSelector((state) => state.userFollow.follow);
  const followStatus = useSelector((state) => state.userFollow.followStatus);
  const following = useSelector(
    (state) => state.userFollow.getFollow.following
  );

  const [loadingUser, setLoadingUser] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(fetchGetAllTextPost());
      dispatch(fetchGetFollow(userInfo.id));
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (followStatus === "succeeded") {
      dispatch(fetchGetFollow(userInfo.id));
      alert(follow.massage);
      setLoadingUser(null);
      dispatch(resetFollow());
    } else if (followStatus === "failed") {
      alert(follow.massage);
      setLoadingUser(null);
      dispatch(resetFollow());
    }
  }, [followStatus, dispatch]);

  const handleFollow = (id) => {
    setLoadingUser(id);
    dispatch(fetchFollowUser(id));
  };

  return (
    <>
      {getAllTextPostStatus === "loading" || getAllTextPostStatus === "idle" ? (
        <div>Loading...</div>
      ) : getAllTextPostStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <>
          <h1 className="text-3xl text-center font-bold my-4">Text Post</h1>
          <div className="w-[96%] md:w-[90%] lg:w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {getAllTextPostStatus === "loading" ||
            getAllTextPostStatus === "idle" ? (
              <p>Loading...</p>
            ) : getAllTextPostStatus === "failed" ? (
              <p>Error</p>
            ) : (
              <>
                {getAllTextPost.length > 0 ? (
                  <>
                    {getAllTextPost.map((post) => (
                      <Card key={post.id}>
                        <CardHeader>
                          <CardTitle className="flex justify-between">
                            <div className="flex space-x-2">
                              <Link to={`/profile/${post.user}`}>
                                <Avatar>
                                  <AvatarImage src={post.profile_image} />
                                  <AvatarFallback>P</AvatarFallback>
                                </Avatar>
                              </Link>
                              <Link to={`/profile/${post.user}`}>
                                <h3 className="text-base md:text-lg font-semibold mt-2">
                                  {post.user_name}
                                </h3>
                              </Link>
                            </div>
                            {post.user === userInfo.id ? null : (
                              <Button
                                className="text-xs md:text-sm"
                                size="sm"
                                variant={
                                  following.includes(post.user)
                                    ? "secondary"
                                    : "default"
                                }
                                onClick={() => handleFollow(post.user)}
                                disabled={
                                  loadingUser === post.user &&
                                  followStatus === "loading"
                                }
                              >
                                {following.includes(post.user) ? (
                                  <UserMinus />
                                ) : loadingUser === post.user &&
                                  followStatus === "loading" ? (
                                  <>
                                    <Loader2 className="animate-spin" />
                                  </>
                                ) : (
                                  <UserPlus />
                                )}
                              </Button>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Link to={`/post/${post.id}`}>
                            <p className="line-clamp-2 cursor-pointer">
                              {post.content}
                            </p>
                          </Link>
                        </CardContent>
                        <CardFooter></CardFooter>
                      </Card>
                    ))}
                  </>
                ) : (
                  <p className="text-lg font-semibold">No Text Post</p>
                )}
              </>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default TextPostPage;
