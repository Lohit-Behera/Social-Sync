import React from "react";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchGetAllTextPost } from "@/features/TextPostSlice";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
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
import { fetchUserDetails } from "@/features/UserSlice";
import { AlignJustify } from "lucide-react";

function TextPostPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);
  const userDetails = useSelector((state) => state.user.userDetails);
  const getAllTextPost = useSelector((state) => state.textPost.getAllTextPost);
  const getAllTextPostStatus = useSelector(
    (state) => state.textPost.getAllTextPostStatus
  );
  const follow = useSelector((state) => state.userFollow.follow);
  const followStatus = useSelector((state) => state.userFollow.followStatus);
  const following = useSelector(
    (state) => state.userFollow.getFollow.following
  );
  const getFollowStatus = useSelector(
    (state) => state.userFollow.getFollowStatus
  );

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
      dispatch(resetFollow());
    }
  }, [followStatus, dispatch]);

  const handleLike = (id) => {
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
          <h1 className="text-3xl text-center font-bold">Text Post</h1>
          <div className="w-[96%] md:w-[90%] lg:w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
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
                        onClick={() => handleLike(post.user)}
                      >
                        {following.includes(post.user)
                          ? "Unfollow"
                          : followStatus === "loading"
                          ? "loading"
                          : "Follow"}
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
          </div>
        </>
      )}
    </>
  );
}

export default TextPostPage;
