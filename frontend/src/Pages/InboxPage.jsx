import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchFollowingList } from "@/features/UserSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function InboxPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const followingList = useSelector((state) => state.user.followingList);
  const followingListStatus = useSelector(
    (state) => state.user.followingListStatus
  );
  useEffect(() => {
    dispatch(fetchFollowingList());
  }, [dispatch]);
  return (
    <>
      {followingListStatus === "loading" || followingListStatus === "idle" ? (
        <p>Loading...</p>
      ) : followingListStatus === "failed" ? (
        <p>Error</p>
      ) : (
        <div className="w-[90%] md:w-[85%] lg:w-[80%] mx-auto">
          <Card className="my-10">
            <CardHeader>
              <CardTitle className="text-2xl md:text-3xl font-bold text-center">
                Inbox
              </CardTitle>
              <div className="md:flex justify-end hidden">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="icon">
                        <RefreshCw />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-background">
                      <p>Refresh</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-end md:hidden">
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {followingList.map((user) => (
                <div
                  key={user.id}
                  className="md:w-[95%] mx-auto flex justify-between bg-background/80 p-4 rounded-lg my-4"
                >
                  <div className=" flex space-x-2 ">
                    <Link to={`/profile/${user.id}`}>
                      <Avatar className="w-10 h-10 md:w-16 md:h-16 hover:border-2 border-primary duration-100">
                        <AvatarImage src={user.profile_image} />
                        <AvatarFallback>P</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex flex-col">
                      <Link to={`/profile/${user.id}`}>
                        <p className="text-sm md:text-base font-semibold text-center hover:underline">
                          {user.user_name}
                        </p>
                      </Link>
                      <Link to={`/profile/${user.id}`}>
                        <p className="text-xs md:text-sm text-muted-foreground/80 font-semibold text-center hover:underline">
                          {user.first_name} {user.last_name}
                        </p>
                      </Link>
                    </div>
                  </div>
                  <Button
                    className="my-auto"
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigate(`/chat/${user.id}`);
                    }}
                  >
                    <Send className="w-5 h-5 md:w-auto md:h-auto" />
                  </Button>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}

export default InboxPage;
