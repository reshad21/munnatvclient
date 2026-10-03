import React from "react";
import { DashboardWrapper } from "../_components/DashboardWrapper";
import BlogsTable from "./_components/BlogsTable";
import ListPageHeader from "@/components/shared/Dashboard/ListPageHeader";
import { TQuery } from "@/types/query.types";
import { getBlogs } from "@/services/blog";
import PaginationWrapper from "@/components/shared/PaginationWrapper";

const BlogsPage = async (props: {
  searchParams: Promise<{ search: string; page: string }>;
}) => {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = parseInt(searchParams.page) || 1;
  const query: TQuery[] = [
    {
      key: "orderBy",
      value: JSON.stringify({
        createdAt: "desc",
      }),
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
      value: "10",
    },
  ];

  const blogsData = await getBlogs(query);
  console.log("get blog data==>", blogsData);
  return (
    <DashboardWrapper>
      <ListPageHeader
        title="Blogs"
        feature="blogs"
        createHref="/dashboard/blogs/create"
      />
      <BlogsTable blogs={blogsData?.data?.data} />
      {/* pagination */}
      {blogsData?.data?.meta?.totalPages > 1 && (
        <PaginationWrapper
          active={page}
          totalPages={blogsData?.data?.meta?.totalPages || 1}
          totalItems={blogsData?.data?.meta?.totalItems || 0}
        />
      )}
    </DashboardWrapper>
  );
};

export default BlogsPage;
