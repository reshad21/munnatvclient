import React from "react";
import HeroAreaCRUD from "./_components/HeroAreaCRUD";
import { getHeroSection } from "@/services/Hero-section";
import { requirePageAccess } from "@/lib/pageGuard";
const HeroAreaPage = async () => {
  const forbidden = await requirePageAccess(
    "page-setting/hero-area",
    "view",
    "You do not have permission to access this page."
  );
  if (forbidden) return <div className="p-6">{forbidden}</div>;

  const heroDataResponse = await getHeroSection([]);
  const heroDataArr = Array.isArray(heroDataResponse?.data) ? heroDataResponse.data : [];
  const heroData = heroDataArr[0];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-[#0f3d3e] mb-6">Hero Area</h1>
      <HeroAreaCRUD heroData={heroData} />
    </div>
  );
};

export default HeroAreaPage;
