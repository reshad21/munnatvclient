import React from "react";
import { DashboardWrapper } from "../../_components/DashboardWrapper";
import ContactUsCRUD from "./_components/ContactUsCRUD";
import { getContactUs } from "@/services/contactus";
import { requirePageAccess } from "@/lib/pageGuard";

const ContactUsPage = async() => {
  const forbidden = await requirePageAccess(
    "page-setting/contact-us",
    "view",
    "You do not have permission to access this page."
  );
  if (forbidden) return <DashboardWrapper>{forbidden}</DashboardWrapper>;

  const contactUsData = await getContactUs([]);
  console.log("seee contactus data==>",contactUsData.data.data)
  return (
    <DashboardWrapper>
      <h1 className="text-2xl font-semibold text-[#0f3d3e] mb-6">Contact Us</h1>
      <ContactUsCRUD contactUsData={contactUsData?.data?.data[0]} />
    </DashboardWrapper>
  );
};

export default ContactUsPage;
