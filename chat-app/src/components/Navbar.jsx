import React, { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { MessageSquareText, Settings } from "lucide-react";

const Navbar = () => {
  const { authUser } = useAuthStore();

  return (
    <nav
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-15">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquareText className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Convoo</h1>
            </Link>
          </div>

          <div className="flex items-center gap-9">
            {authUser && (
              <Link
                to={"/"}
                className={`
              flex items-center justify-between btn-sm gap-2 transition-colors
              hover:opacity-80 transition-all
              `}
              >
                <MessageSquareText className="w-4 h-4" />
                <span className="hidden sm:inline text-sm">Chats</span>
              </Link>
            )}
            <Link
              to={"/settings"}
              className={`
              flex items-center justify-between btn-sm gap-2 transition-colors
              hover:opacity-80 transition-all
              `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link
                  to={"/profile"}
                  className={` flex items-center justify-between btn-sm gap-2 hover:opacity-80 transition-all`}
                >
                  {/* old code */}
                  {/* <User className="size-5" />
                  <span className="hidden sm:inline text-sm">Profile</span> */}

                  {/* show profile pic */}
                  <img
                    className="size-8 rounded-full object-cover"
                    src={
                      authUser.profilePic ? authUser.profilePic : "/default.png"
                    }
                    alt={authUser.email}
                  />
                  <span className="hidden lg:block sm:inline text-sm">
                    {authUser.fullname}
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
