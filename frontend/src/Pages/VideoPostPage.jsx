import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGetAllVideoPost } from "@/features/PostSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VideoPlayer from "@/components/VideoPlayer";
import {
  fetchFollowUser,
  fetchGetFollow,
  resetFollow,
} from "@/features/UserFollowSlice";
import { Loader2 } from "lucide-react";

function VideoPostPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);
  const getAllVideoPost = useSelector((state) => state.post.getAllVideoPost);
  const getAllVideoPostStatus = useSelector(
    (state) => state.post.getAllVideoPostStatus
  );

  const follow = useSelector((state) => state.userFollow.follow);
  const followStatus = useSelector((state) => state.userFollow.followStatus);
  const following =
    useSelector((state) => state.userFollow.getFollow.following) || [];

  const [loadingUser, setLoadingUser] = useState(null);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      dispatch(fetchGetAllVideoPost());
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
      {getAllVideoPostStatus === "loading" ||
      getAllVideoPostStatus === "idle" ? (
        <p>Loading...</p>
      ) : getAllVideoPostStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto">
          <h1 className="text-3xl font-bold text-center my-4">Video Posts</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getAllVideoPost.map((post) => (
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
                          "Unfollow"
                        ) : loadingUser === post.user &&
                          followStatus === "loading" ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                            loading
                          </>
                        ) : (
                          "Follow"
                        )}
                      </Button>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VideoPlayer videoSrc={post.video} />
                </CardContent>
                <CardFooter className="justify-end">
                  <Button
                    size="sm"
                    onClick={() => navigate(`/post/${post.id}`)}
                  >
                    Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default VideoPostPage;
