
import PaginationWrapper from "@/components/shared/PaginationWrapper";
import { getGallery } from "@/services/gallery";
import { TQuery } from "@/types/query.types";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import ListPageHeader from "@/components/shared/Dashboard/ListPageHeader";
import GalleryTable from "./_components/GalleryTable";

const GalleryPage = async (props: { searchParams: Promise<{ search: string; page: string }> }) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;
  const query: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({ createdAt: "desc" }),
    },
    {
      key: "searchTerm",
      value: search,
    },
    {
      key: "page",
      value: page.toString(),
    },
    {
      key: "limit",
      value: "4",
    },
  ];
  const galleryData = await getGallery(query);
  return (
    <DashboardWrapper>
      <ListPageHeader
        title="Gallery"
        feature="gallery"
        createHref="/dashboard/gallery/create"
      />
      <GalleryTable galleryData={galleryData?.data?.data} />
      {galleryData?.data?.meta?.totalPages > 1 && (
        <PaginationWrapper
          active={page}
          totalPages={galleryData?.data?.meta?.totalPages || 1}
          totalItems={galleryData?.data?.meta?.totalItems || 0}
        />
      )}
    </DashboardWrapper>
  );
};

export default GalleryPage;
