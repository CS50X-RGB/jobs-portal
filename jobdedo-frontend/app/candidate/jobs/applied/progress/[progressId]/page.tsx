"use client";
import BomLoadingCardSkeleton from "@/components/Card/BomLoadingCard";
import { getData } from "@/core/api/apiHandler";
import { jobRoutes } from "@/core/api/apiRoutes";
import { Card, CardBody } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, Check, IndianRupee, MapPin, X } from "lucide-react";
import { useParams } from "next/navigation";

export default function ProgressUpdateJob() {
  const { progressId } = useParams();

  const {
    data: getUpdates,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ["getUpdates", progressId],
    queryFn: () => {
      return getData(`${jobRoutes.getProgressUpdate}${progressId}`, {});
    },
  });

  if (isFetching) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center w-full">
        {Array.from({ length: 5 }).map((_, index: number) => (
          <BomLoadingCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  const generateStatus = (status: any) => {
    if (status === "resume_viewed") {
      return "Resume Viewed";
    } else if (status === "interview_added") {
      return "Interview Added";
    } else {
      return status;
    }
  };

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
    <div className="flex flex-col items-center w-full gap-4">
      <Card className="flex flex-col items-center w-3/4">
        <CardBody className="flex flex-row items-center gap-4 justify-between">
          <div className="flex flex-col gap-4 items-center">
            <h1>{getUpdates?.data?.data[0]?.jobId.title}</h1>
            <div className="flex flex-row items-center gap-2">
              <MapPin size={20} />
              <p>{getUpdates?.data?.data[0]?.jobId.jobLocation}</p>
            </div>
            <div className="flex flex-row items-center px-4 gap-4">
              <div className="flex bg-gray-400/20 p-2 rounded-full gap-2 flex-row">
                <Briefcase />
                {getUpdates?.data?.data[0]?.jobId.company.name}
              </div>
              <div className="flex bg-gray-400/20 p-2 rounded-full gap-4 flex-row">
                <IndianRupee />
                {getUpdates?.data?.data[0]?.jobId.salary.min} -{" "}
                {getUpdates?.data?.data[0]?.jobId.salary.max}
              </div>
              <p>
                Posted {getTimeAgo(getUpdates?.data?.data[0]?.jobId.createdAt)}
              </p>
              <p>Applied {getTimeAgo(getUpdates?.data?.data[0].applyDate)}</p>
            </div>
          </div>
        </CardBody>
      </Card>
      <div className="flex items-center bg-white shadow-xl rounded p-5 justify-center w-full max-w-4xl mx-auto">
        {getUpdates?.data.data.map((progress: any, index: number) => {
          const isLast = index === getUpdates.data.data.length - 1;

          return (
            <div key={progress._id} className="flex items-center gap-2 w-full">
              <div className="flex flex-col items-center text-center w-32">
                <div
                  className={
                    progress?.progress === "rejected"
                      ? `bg-red-500 rounded-full p-2`
                      : `bg-green-500 rounded-full p-2`
                  }
                >
                  {progress?.progress === "rejected" ? (
                    <X className="text-white" size={16} />
                  ) : (
                    <Check className="text-white" size={16} />
                  )}
                </div>
                <span className="text-sm text-gray-600 uppercase font-semibold mt-2">
                  {generateStatus(progress?.progress)}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(progress.applyDate).toLocaleDateString()}
                </span>
              </div>

              {/* Line */}
              {!isLast && <div className="flex-1 h-1 bg-green-500" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}
