import React from "react";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { fetchGetAllTextPost, resetGetAllTextPost } from "@/features/PostSlice";
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

  const [loadingUser, setLoadingUser] = useState(null);
  const [textPosts, setTextPosts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [runOneTime, setRunOneTime] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    setTextPosts([]);
  }, []);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else if (textPosts.length === 0) {
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

  useEffect(() => {
    if (getAllTextPostStatus === "succeeded" && runOneTime) {
      setRunOneTime(false);
      setTextPosts((prevTextPosts) => [
        ...prevTextPosts,
        ...getAllTextPost.text_posts,
      ]);
      setCurrentPage(getAllTextPost.current_page);
      setTotalPages(getAllTextPost.total_pages);
      setPageLoading(false);
      dispatch(resetGetAllTextPost());
      setLoading(false);
    } else if (getAllTextPostStatus === "failed") {
      alert(getAllTextPost.massage);
      setPageLoading(false);
      dispatch(resetGetAllTextPost());
    }
  }, [getAllTextPostStatus]);

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
        dispatch(fetchGetAllTextPost(currentPage + 1));
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
        <div>Loading...</div>
      ) : getAllTextPostStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <>
          <h1 className="text-3xl text-center font-bold my-4">Text Post</h1>
          <div className="w-[96%] md:w-[90%] lg:w-[95%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
            {textPosts.length > 0 ? (
              <>
                {textPosts.map((post) => (
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
                    <CardContent className="min-h-60">
                      <Link to={`/post/${post.id}`}>
                        <p className="line-clamp-[8] cursor-pointer">
                          {post.content}
                        </p>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
                {loading && (
                  <Loader2 className="animate-spin mx-auto my-4 w-12 h-12" />
                )}
              </>
            ) : (
              <p className="text-lg font-semibold">No Text Post</p>
            )}
          </div>
        </>
      )}
    </>
  );
}

export default TextPostPage;
