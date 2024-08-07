import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetAllVideoPost,
  resetGetAllVideoPost,
} from "@/features/PostSlice";
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
import { Loader2, UserMinus, UserPlus } from "lucide-react";

function VideoPostPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingUser, setLoadingUser] = useState(null);
  const [videoPosts, setVideoPosts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [runOneTime, setRunOneTime] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const userInfo = useSelector((state) => state.user.userInfo);
  const getAllVideoPost = useSelector((state) => state.post.getAllVideoPost);
  const getAllVideoPostStatus = useSelector(
    (state) => state.post.getAllVideoPostStatus
  );

  const follow = useSelector((state) => state.userFollow.follow);
  const followStatus = useSelector((state) => state.userFollow.followStatus);
  const following =
    useSelector((state) => state.userFollow.getFollow.following) || [];

  useEffect(() => {
    setVideoPosts([]);
  }, []);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (videoPosts.length === 0) {
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

  useEffect(() => {
    if (getAllVideoPostStatus === "succeeded" && runOneTime) {
      setRunOneTime(false);
      setVideoPosts((prevVideoPosts) => [
        ...prevVideoPosts,
        ...getAllVideoPost.video_posts,
      ]);
      setCurrentPage(getAllVideoPost.current_page);
      setTotalPages(getAllVideoPost.total_pages);
      setPageLoading(false);
      dispatch(resetGetAllVideoPost());
      setLoading(false);
    } else if (getAllVideoPostStatus === "failed") {
      alert(getAllVideoPost.massage);
      setPageLoading(false);
      dispatch(resetGetAllVideoPost());
    }
  }, [getAllVideoPostStatus]);

  const handleFollow = (id) => {
    setLoadingUser(id);
    dispatch(fetchFollowUser(id));
  };

  const handleScroll = useCallback(() => {
    const scrollableHeight = document.documentElement.scrollHeight;
    const scrolledFromTop = window.innerHeight + window.scrollY;

    if (Math.round(scrolledFromTop) >= scrollableHeight) {
      console.log("User has scrolled to the bottom", currentPage);
      if (currentPage === totalPages) {
        alert("No more posts to load");
      } else if (currentPage < totalPages) {
        dispatch(fetchGetAllVideoPost(currentPage + 1));
        setLoading(true);
        setRunOneTime(true);
      }
    }
  }, [currentPage, totalPages, dispatch]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      {pageLoading ? (
        <p>Loading...</p>
      ) : getAllVideoPostStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto">
          <h1 className="text-3xl font-bold text-center my-4">Video Posts</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {videoPosts.map((post) => (
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
          {loading && (
            <Loader2 className="animate-spin mx-auto my-4 w-12 h-12" />
          )}
        </div>
      )}
    </>
  );
}

export default VideoPostPage;
