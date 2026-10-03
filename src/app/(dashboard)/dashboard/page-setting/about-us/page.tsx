import React from "react";
import { DashboardWrapper } from "../../_components/DashboardWrapper";
import MainAboutUsForm from "./_components/MainAboutUsForm";
import OthersAboutUsForm from "./_components/OthersAboutUsForm";
import { getAboutus } from "@/services/About-us";
import { getOtherAboutus } from "@/services/OtherAboutUs";
import { requirePageAccess } from "@/lib/pageGuard";

const AboutUsPage = async() => {
  const forbidden = await requirePageAccess(
    "page-setting/about-us",
    "view",
    "You do not have permission to access this page."
  );
  if (forbidden) return <DashboardWrapper>{forbidden}</DashboardWrapper>;

  const aboutUsMainFormData = await getAboutus([]);
  const othersAboutUsData = await getOtherAboutus([]);
  return (
    <DashboardWrapper>
      <h1 className="text-2xl font-semibold text-[#0f3d3e] mb-6">About Us</h1>
      <MainAboutUsForm aboutusData={aboutUsMainFormData?.data}/>
      <OthersAboutUsForm othersData={othersAboutUsData?.data}/>
    </DashboardWrapper>
  );
};

export default AboutUsPage;
