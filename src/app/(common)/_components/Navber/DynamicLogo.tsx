/* eslint-disable @next/next/no-img-element */
import { getContactUs } from "@/services/contactus";
import React from "react";
import Link from "next/link"; // Fix: Import from next/link
import siteLogo from "../../../../../public/hilful_fujul.png";

const DynamicLogo = async () => {
  const topberResponse = await getContactUs([]);
  const topberData = topberResponse?.data?.data[0];
  
  if (!topberResponse) return null;
  
  const imageUrl = topberData?.image || siteLogo.src; // Use .src for static imports

  return (
    <div className="flex items-center gap-2">
      <Link href="/">
        <div className="w-12 h-12 rounded-full border-2 border-[#0E595C] overflow-hidden">
          <img
            src={imageUrl}
            alt="Logo"
            className="object-cover w-full h-full"
          />
        </div>
      </Link>
    </div>
  );
};

export default DynamicLogo;