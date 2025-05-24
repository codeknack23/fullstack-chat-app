import React, { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import SidebarSkeleton from "../skeleton/SidebarSkeleton.jsx";
import { Users, Ellipsis, Search } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore.js";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";
import useFriendRequestsStore from "../store/friendRequestsStore";

const Sidebar = ({ fullWidth }) => {
  const { users, selectedUser, isUsersLoading, getUsers, setSelectedUser } = useChatStore();
  const { onlineUsers, authUser, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedUsersLoading, setSearchedUsersLoading] = useState(false);
  const skeletonContacts = Array(8).fill(null);

  // Get friend requests and fetch function from store
  const { friendRequests, fetchFriendRequests } = useFriendRequestsStore();

  useEffect(() => {
    setSearchedUsersLoading(true);
    if (searchTerm.length >= 1) {
      axiosInstance
        .get(`/auth/search?name=${searchTerm}`)
        .then((response) => {
          setSearchedUsers(response.data);
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
        })
        .finally(() => {
          setSearchedUsersLoading(false);
        });
    } else {
      setSearchedUsers([]);
      setSearchedUsersLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    getUsers();

    // Fetch friend requests immediately on mount
    fetchFriendRequests();
  }, []);

  if (isUsersLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside
      className={`relative pb-32 lg:pb-20 h-full ${
        fullWidth ? "w-full" : "w-20"
      } md:w-72 border-r border-base-300 flex flex-col transition-all duration-200`}
    >
      <div className="w-full p-4">
        <div className="flex items-center gap-3 justify-between w-full">
          <span className="font-bold block">Chats</span>
          <div className="flex items-center gap-4">
            <Link to="/explore" title="Explore">
              <Search className="size-5 opacity-70 hover:opacity-100 transition" />
            </Link>

            {/* Friend Requests icon with notification badge */}
            <Link to="/friend-requests" title="Friend Requests" className="relative">
              <Users className="size-5 opacity-70 hover:opacity-100 transition" />
              {friendRequests.length > 0 && (
                <span
                  className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/2 -translate-y-1/2"
                  aria-label={`${friendRequests.length} new friend request${friendRequests.length > 1 ? "s" : ""}`}
                >
                  {friendRequests.length}
                </span>
              )}
            </Link>

            {fullWidth && (
              <div className="drawer z-99">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                  <label htmlFor="my-drawer" className="border-none drawer-button">
                    <Ellipsis className="size-5 mr-1 opacity-50 " />
                  </label>
                </div>
                <div className="drawer-side">
                  <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                  <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
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
            )}
          </div>
        </div>
      </div>

      <label className="input min-h-[3em] max-h-[3em] w-full mb-2 pr-5">
        <svg
          className="h-[1em] opacity-50"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          required
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </label>

      <div className="overflow-y-auto w-full py-3 ">
        {searchedUsers.length === 0 && searchTerm.length === 0 && (
          <>
            {users.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-3 flex items-center gap-3
                  hover:bg-base-200 transition-colors
                  ${
                    selectedUser?._id === user._id
                      ? "bg-base-300 ring-1 ring-base-300"
                      : ""
                  }`}
              >
                <div className="relative lg:mx-0">
                  <img
                    src={user.profilePic || "/default.png"}
                    alt={user.name}
                    className="size-12 object-cover rounded-full"
                  />
                  {onlineUsers.includes(user._id) ? (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                  ) : (
                    <span className="absolute bottom-0 right-0 size-3 bg-zinc-400 rounded-full ring-2 ring-zinc-900" />
                  )}
                </div>
                <div className="md:block text-left min-w-0">
                  <div className="font-medium truncate">{user.fullname}</div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "online" : "offline"}
                  </div>
                </div>
              </button>
            ))}
          </>
        )}

        {searchedUsers.length > 0 && searchTerm.length !== 0 && (
          <>
            {searchedUsers.map((user) => (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`w-full p-3 flex items-center gap-3
                  hover:bg-base-200 transition-colors
                  ${
                    selectedUser?._id === user._id
                      ? "bg-base-300 ring-1 ring-base-300"
                      : ""
                  }`}
              >
                <div className="relative lg:mx-0">
                  <img
                    src={user.profilePic || "/default.png"}
                    alt={user.name}
                    className="size-12 object-cover rounded-full"
                  />
                  {onlineUsers.includes(user._id) ? (
                    <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-zinc-900" />
                  ) : (
                    <span className="absolute bottom-0 right-0 size-3 bg-zinc-400 rounded-full ring-2 ring-zinc-900" />
                  )}
                </div>
                <div className="md:block text-left min-w-0">
                  <div className="font-medium truncate">{user.fullname}</div>
                  <div className="text-sm text-zinc-400">
                    {onlineUsers.includes(user._id) ? "online" : "offline"}
                  </div>
                </div>
              </button>
            ))}
          </>
        )}

        {users.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            No friends. Make new  <Link to={"/explore"} className=" text-primary">friends</Link>
          </div>
        )}

        {searchedUsersLoading && (
          <div className="overflow-y-auto w-full py-3">
            {skeletonContacts.map((_, idx) => (
              <div key={idx} className="w-full p-3 flex items-center gap-3">
                <div className="relative mx-auto lg:mx-0">
                  <div className="skeleton size-12 rounded-full" />
                </div>
                <div className="hidden lg:block text-left min-w-0 flex-1">
                  <div className="skeleton h-4 w-32 mb-2" />
                  <div className="skeleton h-3 w-16" />
                </div>
              </div>
            ))}
          </div>
        )}

        {searchedUsers.length === 0 &&
          searchTerm.length > 0 &&
          searchedUsersLoading === false && (
            <div className="text-center text-zinc-500 py-4">No user found</div>
          )}
      </div>

      <div className="absolute pr-3 flex-col left-0 bottom-0 w-full p-2 md:flex-row sm:flex-col sm:items-center gap-4 flex items-center justify-between border-t border-neutral-600 py-5 ">
        {authUser && (
          <>
            <div className="hidden md:flex items-center justify-center btn-sm gap-2 hover:opacity-80 transition-all">
              <img
                className="size-9 rounded-full object-cover"
                src={authUser.profilePic ? authUser.profilePic : "/default.png"}
                alt={authUser.email}
              />
              <span className="hidden md:block sm:hidden text-sm">
                {authUser.fullname}
              </span>
            </div>
            {!fullWidth && (
              <div className="dropdown dropdown-top ">
                <div tabIndex={0} role="button" className=" m-1 bg-transparent">
                  <Ellipsis className="size-5 mr-1 opacity-50 " />
                </div>
                <ul className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
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
