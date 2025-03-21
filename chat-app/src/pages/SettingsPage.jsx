import React from "react";
import { Link } from "react-router-dom";
import { Construction, Wrench } from "lucide-react";
import Navbar from "../components/Navbar.jsx";

const SettingsPage = () => {
  return (
    <>
      <Navbar />
      <div className="h-screen bg-base-300 flex flex-col items-center justify-center gap-2">
        <Construction className="mr-3 size-3xl" /> Under Building Process -
        Check again later{" "}
        <Link to={"/"} className="mt-2 btn btn-active btn-primary">
          Go back
        </Link>
      </div>
    </>
  );
};

export default SettingsPage;
