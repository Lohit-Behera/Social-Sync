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

function PostDetails() {
  const dispatch = useDispatch();

  const { id } = useParams();
  const getTextPost = useSelector((state) => state.textPost.getTextPost) || {};
  const getTextPostStatus = useSelector(
    (state) => state.textPost.getTextPostStatus
  );

  const post = getTextPost ? getTextPost.post : {};
  const user = getTextPost ? getTextPost.user : {};

  useEffect(() => {
    dispatch(fetchGetTextPost(id));
  }, [dispatch, id]);

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
                  <Link to={`/profile/${user.id}`}>
                    <Avatar>
                      <AvatarImage src={user.profile_image} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <Link to={`/profile/${user.id}`}>
                    <h3 className="text-lg md:text-xl font-semibold mt-2">
                      {user.user_name}
                    </h3>
                  </Link>
                </CardTitle>
                <CardDescription>
                  {user.first_name} {user.last_name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
              </CardContent>
              <CardFooter>
                <div className="flex justify-end w-full space-x-4">
                  <div className="flex flex-col">
                    <Heart />
                    <p className="text-center">{post.likes}</p>
                  </div>
                  <div className="flex flex-col">
                    <MessageCircle />
                    <p className="text-center">{post.comments}</p>
                  </div>
                  <div className="flex flex-col">
                    <Send />
                    <p className="text-center">{post.shares}</p>
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
