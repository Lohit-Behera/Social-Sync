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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  fetchGetTextPost,
  fetchDeleteTextPost,
  resetDeleteTextPost,
} from "@/features/TextPostSlice";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Send, Pencil, Trash } from "lucide-react";
import { fetchLike, resetLike } from "@/features/PostSlice";
import Comments from "@/components/Comments";

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
  const deleteTextPostStatus = useSelector(
    (state) => state.textPost.deleteTextPostStatus
  );

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

  useEffect(() => {
    if (deleteTextPostStatus === "succeeded") {
      navigate("/text-post");
      dispatch(resetDeleteTextPost());
      alert("Post deleted successfully");
    } else if (deleteTextPostStatus === "failed") {
      alert("Something went wrong");
    }
  }, [deleteTextPostStatus]);

  const handleLike = () => {
    if (userInfo) {
      dispatch(fetchLike(id));
    } else {
      navigate("/login");
    }
  };

  const handleDelete = () => {
    if (userInfo) {
      dispatch(fetchDeleteTextPost(id));
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
                <CardTitle className="flex justify-between ">
                  <div className="flex space-x-2">
                    <Link to={`/profile/${getTextPost.user}`}>
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={getTextPost.profile_image} />
                        <AvatarFallback>P</AvatarFallback>
                      </Avatar>
                    </Link>
                    <Link to={`/profile/${getTextPost.user}`}>
                      <h3 className="text-lg md:text-xl font-semibold mt-2">
                        {getTextPost.user_name}
                      </h3>
                    </Link>
                  </div>
                  {userInfo?.id === getTextPost.user && (
                    <div className="flex space-x-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          navigate(`/edit-post/${getTextPost.id}/text`)
                        }
                      >
                        <Pencil />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="icon" variant="outline">
                            <Trash />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your Post and remove your data
                              from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDelete(getTextPost.id)}
                              variant="destructive"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}
                </CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>
                <p>{getTextPost.content}</p>
              </CardContent>
              <CardFooter>
                <div className="flex justify-between w-full">
                  <p className="text-xs text-muted-foreground">
                    Created at: {getTextPost.created_at.slice(0, 10)}{" "}
                    {getTextPost.edited && "(edited)"}
                  </p>
                  <div className="flex space-x-4">
                    <div className="flex flex-col">
                      <Heart onClick={handleLike} className="cursor-pointer" />
                      <p className="text-center">{getTextPost.total_likes}</p>
                    </div>
                    <div className="flex flex-col">
                      <MessageCircle />
                      <p className="text-center">
                        {getTextPost.total_comments}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <Send />
                      <p className="text-center">{getTextPost.total_shares}</p>
                    </div>
                  </div>
                </div>
              </CardFooter>
              <Comments id={id} />
            </Card>
          </div>
        </>
      )}
    </>
  );
}

export default PostDetails;
