import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/features/UserSlice";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Image,
  Send,
  NotebookText,
  Clapperboard,
  PanelLeft,
  LogIn,
  SquarePlus,
} from "lucide-react";
import Logo from "@/assets/Logo.svg";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import DarkModeToggle from "./DarkModeToggle";

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = useSelector((state) => state.user.userInfo);

  const handleLogout = () => {
    dispatch(logout());
  };
  return (
    <>
      <div className="hidden md:flex">
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
          <nav className="flex flex-col items-center gap-4 px-2">
            <Link to="#" className="mt-2">
              <Avatar className="hover:scale-110 duration-300">
                <AvatarImage src={Logo} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </Link>
            {userInfo ? (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink to="/">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            size="icon"
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <Home />
                          </Button>
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">Home</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink to="/chat">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            size="icon"
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <Send />
                          </Button>
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">Chat</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink to="/text">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            size="icon"
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <NotebookText />
                          </Button>
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">Text</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink to="/Picture">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            size="icon"
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <Image />
                          </Button>
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">Picture</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink to="/video">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            size="icon"
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <Clapperboard />
                          </Button>
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">Video</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <NavLink to="/create-post">
                        {({ isActive }) => (
                          <Button
                            variant={`${isActive ? "default" : "ghost"}`}
                            size="icon"
                            className={`${
                              !isActive &&
                              "text-muted-foreground transition-colors hover:text-foreground"
                            }`}
                          >
                            <SquarePlus />
                          </Button>
                        )}
                      </NavLink>
                    </TooltipTrigger>
                    <TooltipContent side="right">Create Post</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <NavLink to="/login">
                      {({ isActive }) => (
                        <Button
                          variant={`${isActive ? "default" : "ghost"}`}
                          size="icon"
                          className={`${
                            !isActive &&
                            "text-muted-foreground transition-colors hover:text-foreground"
                          }`}
                        >
                          <LogIn />
                        </Button>
                      )}
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="right">Login</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </nav>
          <nav className="mt-auto flex flex-col items-center gap-4 px-2 mb-2">
            <DarkModeToggle />
            {userInfo && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate(`/profile/${userInfo.id}`)}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </aside>
      </div>
      <header className="block md:hidden">
        <nav className="flex justify-between p-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link href="#" className="">
                  <Avatar>
                    <AvatarImage src={Logo} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                {userInfo ? (
                  <>
                    <NavLink to="/">
                      {({ isActive }) => (
                        <Button
                          variant={`${isActive ? "default" : "ghost"}`}
                          className={`${
                            !isActive &&
                            "text-muted-foreground transition-colors hover:text-foreground"
                          }`}
                        >
                          <Home className="mr-2 h-4 w-4" /> Home
                        </Button>
                      )}
                    </NavLink>

                    <NavLink to="/chat">
                      {({ isActive }) => (
                        <Button
                          variant={`${isActive ? "default" : "ghost"}`}
                          className={`${
                            !isActive &&
                            "text-muted-foreground transition-colors hover:text-foreground"
                          }`}
                        >
                          <Send className="mr-2 h-4 w-4" />
                          Chat
                        </Button>
                      )}
                    </NavLink>

                    <NavLink to="/text">
                      {({ isActive }) => (
                        <Button
                          variant={`${isActive ? "default" : "ghost"}`}
                          className={`${
                            !isActive &&
                            "text-muted-foreground transition-colors hover:text-foreground"
                          }`}
                        >
                          <NotebookText className="mr-2 h-4 w-4" />
                          Text
                        </Button>
                      )}
                    </NavLink>

                    <NavLink to="/Picture">
                      {({ isActive }) => (
                        <Button
                          variant={`${isActive ? "default" : "ghost"}`}
                          className={`${
                            !isActive &&
                            "text-muted-foreground transition-colors hover:text-foreground"
                          }`}
                        >
                          <Image className="mr-2 h-4 w-4" />
                          Picture
                        </Button>
                      )}
                    </NavLink>

                    <NavLink to="/video">
                      {({ isActive }) => (
                        <Button
                          variant={`${isActive ? "default" : "ghost"}`}
                          className={`${
                            !isActive &&
                            "text-muted-foreground transition-colors hover:text-foreground"
                          }`}
                        >
                          <Clapperboard className="mr-2 h-4 w-4" />
                          Video
                        </Button>
                      )}
                    </NavLink>
                    <NavLink to="/create-post">
                      {({ isActive }) => (
                        <Button
                          variant={`${isActive ? "default" : "ghost"}`}
                          className={`${
                            !isActive &&
                            "text-muted-foreground transition-colors hover:text-foreground"
                          }`}
                        >
                          <SquarePlus className="mr-2 h-4 w-4" />
                          Create Post
                        </Button>
                      )}
                    </NavLink>
                  </>
                ) : (
                  <NavLink to="/login">
                    {({ isActive }) => (
                      <Button
                        variant={`${isActive ? "default" : "ghost"}`}
                        className={`${
                          !isActive &&
                          "text-muted-foreground transition-colors hover:text-foreground"
                        }`}
                      >
                        <LogIn className="mr-2 h-4 w-4" /> Login
                      </Button>
                    )}
                  </NavLink>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex justify-center space-x-3">
            <DarkModeToggle />
            {userInfo && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => navigate(`/profile/${userInfo.id}`)}
                  >
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Support</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}

export default Navigation;
