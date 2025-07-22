"use client";
import BomLoadingCardSkeleton from "@/components/Card/BomLoadingCard";
import { getData } from "@/core/api/apiHandler";
import { jobRoutes } from "@/core/api/apiRoutes";
import { Card, CardBody } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Briefcase, IndianRupee } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AppliedJobs() {
  const {
    data: getAppliedJobs,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ["getAppliedJob"],
    queryFn: () => {
      return getData(jobRoutes.appliedJobsCandidated, {});
    },
  });

  const router = useRouter();

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        {Array.from({ length: 5 }).map((_, index: number) => (
          <BomLoadingCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  function getTimeAgo(createdAt: string) {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
    }
    const months = Math.floor(diffDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold flex flex-row justify-start text-start">
        Jobs Applied
      </h1>
      {getAppliedJobs?.data.data.map((job: any, _: any) => {
        return (
          <Card
            onPress={() =>
              router.push(`/candidate/jobs/applied/progress/${job._id}`)
            }
            isPressable
            className="w-3/4"
            key={job._id}
          >
            <CardBody className="flex flex-row items-center gap-4 justify-between">
              <div className="flex flex-col gap-4 items-center">
                <h1>{job.title}</h1>
                <div className="flex flex-row items-center gap-2">
                  <MapPin size={20} />
                  <p>{job.jobLocation}</p>
                </div>
                <div className="flex flex-row items-center px-4 gap-4">
                  <div className="flex bg-gray-400/20 p-2 rounded-full gap-2 flex-row">
                    <Briefcase />
                    {job.company.name}
                  </div>
                  <div className="flex bg-gray-400/20 p-2 rounded-full gap-4 flex-row">
                    <IndianRupee />
                    {job.salary.min} - {job.salary.max}
                  </div>
                  <p>Posted {getTimeAgo(job.createdAt)}</p>
                  <p>Applied {getTimeAgo(job.progress[0].applyDate)}</p>
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
