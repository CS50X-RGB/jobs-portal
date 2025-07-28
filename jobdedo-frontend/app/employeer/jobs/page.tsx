"use client";
import BomLoadingCardSkeleton from "@/components/Card/BomLoadingCard";
import JobsCard from "@/components/Card/JobsCard";
import { getData } from "@/core/api/apiHandler";
import { accountRoutes, jobRoutes } from "@/core/api/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Jobs() {
  const [page, setPages] = useState<any>(1);

  const {
    data: getJobs,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ["getJobs"],
    queryFn: () => {
      return getData(`${jobRoutes.getBom}${page}/5`, {});
    },
  });

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        {Array.from({ length: 5 }).map((_, index: number) => (
          <BomLoadingCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-row flex-wrap items-center p-5 gap-4 justify-center">
      {getJobs?.data.data.map((job: any, index: number) => {
        return <JobsCard jobData={job} key={index} />;
      })}
    </div>
  );
}
