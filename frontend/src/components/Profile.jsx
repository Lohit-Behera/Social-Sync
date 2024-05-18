import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Profile({ user = {} }) {
  const {
    profile_image,
    user_name,
    first_name,
    last_name,
    followers = [],
    following = [],
  } = user;

  return (
    <div className="w-[96%] md:w-[80%] lg:w-[70%] mx-auto mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col justify-center space-y-2">
            <Avatar className="mx-auto w-24 h-24">
              <AvatarImage src={profile_image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <p className="text-lg md:text-xl font-semibold text-center">
              {user_name}
            </p>
          </CardTitle>
          <CardDescription className="text-center">
            {first_name} {last_name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3">
            <div>
              <p className="text-lg md:text-xl font-semibold mt-2 text-center">
                Followers
              </p>
              <p className="text-center">{followers.length}</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-semibold mt-2 text-center">
                Following
              </p>
              <p className="text-center">{following.length}</p>
            </div>
            <div>
              <p className="text-lg md:text-xl font-semibold mt-2 text-center">
                Post
              </p>
              <p className="text-center">{followers.length}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-lg md:text-xl font-semibold">Posts</p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Profile;
