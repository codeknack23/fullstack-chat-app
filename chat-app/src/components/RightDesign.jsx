import { MessageSquareText } from "lucide-react";
import React from "react";

const RightDesign = ({ title, subtitle }) => {
  return (
    <div className="hidden flex-col lg:flex items-center justify-center bg-base-200 p-12">
      <div
        className="size-16 rounded-xl bg-primary/10 flex items-center justify-center 
              group-hover:bg-primary/20 transition-colors mb-6"
      >
        <MessageSquareText className="size-8 text-primary " />
      </div>
      <div className="max-w-md text-center">
        {/* <h1 className="text-4xl font-bold mb-9">Convoo</h1> */}

        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>
    </div>
  );
};

export default RightDesign;
