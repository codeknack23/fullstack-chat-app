import React, { useEffect } from "react";
import { useChatStore } from "../store/useChatStore.js";
import SidebarSkeleton from "../skeleton/SidebarSkeleton.jsx";
import { Users, Ellipsis, MessageSquareText } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";

const Sidebar = ({ fullWidth }) => {
  const { users, selectedUser, isUsersLoading, getUsers, setSelectedUser } =
    useChatStore();

  const { onlineUsers, authUser, logout } = useAuthStore();

  useEffect(() => {
    getUsers();
  }, []);
  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }
  return (
    <aside
      className={`relative pb-32 lg:pb-20 h-full ${
        fullWidth ? "w-full" : "w:20"
      } md:w-72 border-r border-base-300 flex flex-col transition-all duration-200`}
    >
      <div className="border-b border-neutral-600 w-full p-4 mb-4">
        <div className="flex items-center gap-3 justify-between w-full">
          {/* <MessageSquareText className=" size-6 block md:hidden m-auto" /> */}
          <span className="font-bold block">Chats</span>
          <span>{fullWidth && (
              <div className="drawer z-99">
                <input
                  id="my-drawer"
                  type="checkbox"
                  className="drawer-toggle"
                />
                <div className="drawer-content">
                  {/* Page content here */}
                  <label
                    htmlFor="my-drawer"
                    className="border-none drawer-button"
                  >
                   <Ellipsis className="size-5 mr-1 opacity-50 " />
                  </label>
                </div>
                <div className="drawer-side">
                  <label
                    htmlFor="my-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                  ></label>
                  <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    {/* Sidebar content here */}
                    <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/settings">Settings</Link>
                  </li>
                  <li>
                    <button onClick={logout} alt="logout">
                      Log out
                    </button>
                  </li>
                  </ul>
                </div>
              </div>
            )}</span>
        </div>
      </div>

      {/* TODO: Online filter toggle */}
      <div className="overflow-y-auto w-full py-3 ">
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-200 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative lg:mx-0">
              <img
                src={user.profilePic || "/default.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) ? (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              ) : (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-zinc-400
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className=" md:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullname}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {users.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No users available
          </div>
        )}
      </div>

      <div className="absolute pr-3 flex-col left-0 bottom-0 w-full p-2 md:flex-row sm:flex-col sm:items-center gap-4 flex items-center justify-between border-t border-neutral-600 py-5 ">
        {" "}
        {authUser && (
          <>
            {" "}
            <div
              // to={"/profile"}
              className={`hidden md:flex items-center justify-center btn-sm gap-2 hover:opacity-80 transition-all`}
            >
              {/* show profile pic */}
              <img
                className="size-9 rounded-full object-cover"
                src={authUser.profilePic ? authUser.profilePic : "/default.png"}
                alt={authUser.email}
              />
              <span className="hidden md:block sm:hidden text-sm">
                {authUser.fullname}
              </span>
            </div>
            {/* <Link to="/settings">
              <Ellipsis className="size-4.5 mr-3 opacity-50 " />
            </Link> */}
            {!fullWidth && (
              <div className="dropdown dropdown-top ">
                <div tabIndex={0} role="button" className=" m-1 bg-transparent">
                  <Ellipsis className="size-5 mr-1 opacity-50 " />
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm"
                >
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/settings">Settings</Link>
                  </li>
                  <li>
                    <button onClick={logout} alt="logout">
                      Log out
                    </button>
                  </li>
                </ul>
              </div>
            )}
           
          </>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
