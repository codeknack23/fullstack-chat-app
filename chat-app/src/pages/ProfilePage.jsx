import React, { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, X } from "lucide-react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "../components/Navbar.jsx";

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null);
  const { authUser, isUpdatingProfile, updateProfile,checkAuth, logout } = useAuthStore();
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];

    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Result = reader.result;
      setSelectedImg(base64Result);
      await updateProfile({ profilePic: base64Result });
    };
  };

   useEffect(() => {
      checkAuth();
    }, []);
  return (
    <>
      <Navbar />
      <div className="h-screen  pt-20">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-base-300 rounded-xl p-6 space-y-8">
            <div className="w-full flex items-center justify-end">
              <Link to="/">
                <X className="size-7 mt-2" />
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-semibold ">Profile</h1>
              <p className="mt-2">Your profile information</p>
            </div>

            {/* avatar upload section */}

            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src={selectedImg || authUser.profilePic || "/default.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 "
                />
                <label
                  htmlFor="avatar-upload"
                  className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${
                    isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
                  }
                `}
                >
                  <Camera className="w-5 h-5 text-base-200" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile}
                  />
                </label>
              </div>
              <p className="text-sm text-zinc-400">
                {isUpdatingProfile
                  ? "Uploading..."
                  : "Click the camera icon to update your photo"}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border cursor-not-allowed">
                  {authUser?.fullname}
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-base-200 rounded-lg border cursor-not-allowed">
                  {authUser?.email}
                </p>
              </div>

              <div className="mt-6 bg-base-300 rounded-xl p-6">
                <h2 className="text-lg font-medium  mb-4">
                  Account Information
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-3 border-b border-zinc-700">
                    <span>Member Since</span>
                    <span>{authUser.createdAtFormatted}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-zinc-700">
                    <span>Account Status</span>
                    <span className="text-green-500">Active</span>
                  </div>
                  <div className="flex items-center justify-center py-2">
                    {/* <span>Logout</span> */}

                    {/* <button
                    onClick={logout}
                    className="text-red-500 font-semibold mt-5 cursor-pointer"
                  >
                    Log out
                  </button> */}

                    <button
                      onClick={logout}
                      className="mt-8 outline-0 font-semibold w-full bg-primary text-white font-semibold btn rounded flex items-center justify-center "
                    alt="logout"
                    >
                      Log out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
