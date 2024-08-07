import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchGetAllImagePost,
  resetGetAllImagePost,
} from "@/features/PostSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchFollowUser,
  fetchGetFollow,
  resetFollow,
} from "@/features/UserFollowSlice";
import { Loader2, UserMinus, UserPlus } from "lucide-react";

function ImagePostPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loadingUser, setLoadingUser] = useState(null);
  const [imagePosts, setImagePosts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [runOneTime, setRunOneTime] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const userInfo = useSelector((state) => state.user.userInfo);
  const getAllImagePost = useSelector((state) => state.post.getAllImagePost);
  const getAllImagePostStatus = useSelector(
    (state) => state.post.getAllImagePostStatus
  );

  const follow = useSelector((state) => state.userFollow.follow);
  const followStatus = useSelector((state) => state.userFollow.followStatus);
  const following =
    useSelector((state) => state.userFollow.getFollow.following) || [];

  useEffect(() => {
    setImagePosts([]);
  }, []);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (imagePosts.length === 0) {
      dispatch(fetchGetAllImagePost());
      dispatch(fetchGetFollow(userInfo.id));
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (followStatus === "succeeded") {
      dispatch(fetchGetFollow(userInfo.id));
      alert(follow.message);
      setLoadingUser(null);
      dispatch(resetFollow());
    } else if (followStatus === "failed") {
      alert(follow.message);
      setLoadingUser(null);
      dispatch(resetFollow());
    }
  }, [followStatus, dispatch]);

  useEffect(() => {
    if (getAllImagePostStatus === "succeeded" && runOneTime) {
      setRunOneTime(false);
      setImagePosts((prevImagePosts) => [
        ...prevImagePosts,
        ...getAllImagePost.image_posts,
      ]);
      setCurrentPage(getAllImagePost.current_page);
      setTotalPages(getAllImagePost.total_pages);
      setPageLoading(false);
      dispatch(resetGetAllImagePost());
      setLoading(false);
    } else if (getAllImagePostStatus === "failed") {
      setPageLoading(false);
      setLoading(false);
      dispatch(resetGetAllImagePost());
    }
  }, [getAllImagePostStatus]);

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
        dispatch(fetchGetAllImagePost(currentPage + 1));
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
      ) : getAllImagePostStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <div className="w-[95%] md:w-[90%] lg:w-[85%] mx-auto mb-6">
          <h1 className="text-3xl font-bold text-center my-4">Image Posts</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {imagePosts.map((post) => (
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
                        <h3 className="text-base md:text-lg font-semibold mt-2 md:mt-0.5 lg:mt-1">
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
                    <img
                      className="w-full h-auto md:h-60 object-cover"
                      src={post.image}
                    />
                  </Link>
                </CardContent>
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

export default ImagePostPage;
