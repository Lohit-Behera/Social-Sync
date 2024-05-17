import React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreateTextPost,
  resetCreateTextPost,
} from "@/features/TextPostSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

function CreatePost() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);
  const createTextPost = useSelector((state) => state.textPost.createTextPost);
  const createTextPostStatus = useSelector(
    (state) => state.textPost.createTextPostStatus
  );

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const [textContent, setTextContent] = useState("");

  useEffect(() => {
    if (createTextPostStatus === "succeeded") {
      alert("Post created successfully");
      dispatch(resetCreateTextPost());
      navigate(`/post/${createTextPost.id}`);
    } else if (createTextPostStatus === "failed") {
      alert("Something went wrong");
      dispatch(resetCreateTextPost());
    }
  }, [createTextPostStatus, navigate, dispatch]);

  const handleTextPost = () => {
    dispatch(
      fetchCreateTextPost({
        content: textContent,
      })
    );
  };
  return (
    <div className="mt-2 w-full">
      <h1 className="text-3xl text-center font-bold">Create Post</h1>
      <div className="flex justify-center mt-6">
        <Card className="w-[90%] md:w-[80%] lg:w-[70%]">
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold text-center">Text Post</h2>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="grid gap-2 w-full">
              <Label htmlFor="message">Create Post</Label>
              <Textarea
                id="message"
                placeholder="Write something..."
                required
                onChange={(e) => setTextContent(e.target.value)}
                className="resize-none w-full "
                rows={14}
              />
            </div>
            <Button
              variant="default"
              className="w-full"
              size="sm"
              onClick={handleTextPost}
            >
              Post
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default CreatePost;
