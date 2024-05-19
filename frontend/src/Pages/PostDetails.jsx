import React from "react";
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
import { fetchGetTextPost } from "@/features/TextPostSlice";
import { Heart, MessageCircle, Send } from "lucide-react";
import { fetchLike, resetLike } from "@/features/PostSlice";

function PostDetails() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();
  const userInfo = useSelector((state) => state.user.userInfo);
  const getTextPost = useSelector((state) => state.textPost.getTextPost) || {};
  const getTextPostStatus = useSelector(
    (state) => state.textPost.getTextPostStatus
  );
  const postLike = useSelector((state) => state.post.postLike);

  const postLikeStatus = useSelector((state) => state.post.postLikeStatus);

  useEffect(() => {
    dispatch(fetchGetTextPost(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (postLike.message === "Post liked") {
      dispatch(fetchGetTextPost(id));
      dispatch(resetLike());
      alert("post liked successfully");
    } else if (postLike.message === "Post unliked") {
      dispatch(fetchGetTextPost(id));
      dispatch(resetLike());
      alert("post unliked successfully");
    } else if (postLikeStatus === "failed") {
      dispatch(resetLike());
      alert("Something went wrong");
    }
  }, [postLikeStatus]);

  const handleLike = () => {
    if (userInfo) {
      dispatch(fetchLike(id));
    } else {
      navigate("/login");
    }
  };

  return (
    <>
      {getTextPostStatus === "loading" || getTextPostStatus === "idle" ? (
        <p>Loading...</p>
      ) : getTextPostStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <>
          <h1 className="text-3xl text-center font-bold my-6">Post Details</h1>
          <div className="w-[90%] md:w-[80%] lg:w-[70%] mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex space-x-2">
                  <Link to={`/profile/${getTextPost.user}`}>
                    <Avatar>
                      <AvatarImage src={getTextPost.profile_image} />
                      <AvatarFallback>P</AvatarFallback>
                    </Avatar>
                  </Link>
                  <Link to={`/profile/${getTextPost.user}`}>
                    <h3 className="text-lg md:text-xl font-semibold mt-2">
                      {getTextPost.user_name}
                    </h3>
                  </Link>
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <p>{getTextPost.content}</p>
              </CardContent>
              <CardFooter>
                <div className="flex justify-end w-full space-x-4">
                  <div className="flex flex-col">
                    <Heart onClick={handleLike} className="cursor-pointer" />
                    <p className="text-center">{getTextPost.total_likes}</p>
                  </div>
                  <div className="flex flex-col">
                    <MessageCircle />
                    <p className="text-center">{getTextPost.total_comments}</p>
                  </div>
                  <div className="flex flex-col">
                    <Send />
                    <p className="text-center">{getTextPost.total_shares}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </div>
        </>
      )}
    </>
  );
}

export default PostDetails;
