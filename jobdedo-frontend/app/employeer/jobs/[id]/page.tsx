"use client";
import { queryClient } from "@/app/providers";
import BomLoadingCardSkeleton from "@/components/Card/BomLoadingCard";
import { getData, putData } from "@/core/api/apiHandler";
import { jobRoutes } from "@/core/api/apiRoutes";
import { Card, CardBody, CardFooter, CardHeader, Button } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Briefcase, IndianRupee, MapPin } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function SingleJob() {
  const { id } = useParams();
  const {
    data: getJob,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ["getJob", id],
    queryFn: () => {
      return getData(`${jobRoutes.getSingleJob}${id}`, {});
    },
  });
  const profileData: any = queryClient.getQueryData(["getProfile"]);
  const userData: any = profileData?.data?.data?._id;
  console.log(profileData.data.data);
  const applyForJob = useMutation({
    mutationKey: ["applyForJob"],
    mutationFn: (data: any) => {
      return putData(`${jobRoutes.apply}${id}`, {}, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success("Applied for the job", {
        position: "top-right",
      });
    },
    onError: (error: any) => {
      toast.error("Application for the job failed", {
        position: "top-right",
      });
    },
  });

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
    <div className="flex flex-col items-center gap-4 p-10">
      <Card className="w-3/4 p-2">
        <CardHeader className="flex flex-col gap-4 items-start text-xl font-bold">
          <p>{getJob?.data?.data?.title}</p>
          <div className="flex flex-row items-center">
            <p>{getJob?.data?.data?.company?.name}</p>
          </div>
        </CardHeader>

        <CardBody className="flex flex-col items-start gap-2 justify-start">
          <div className="flex flex-row items-center gap-4">
            {/* Experience */}
            <div className="flex rounded-xl bg-gray-400/20 p-2 flex-row items-center gap-2">
              <Briefcase size={18} />
              <p>{getJob?.data?.data?.experienceNeeded?.min}</p>
              <span>-</span>
              <p>{getJob?.data?.data?.experienceNeeded?.max} yrs</p>
            </div>

            {/* Salary */}
            <div className="flex rounded-xl bg-gray-400/20 p-2 flex-row items-center gap-2">
              <IndianRupee size={18} />
              <p>{getJob?.data?.data?.salary?.min?.toLocaleString("en-IN")}</p>
              <span>-</span>
              <p>{getJob?.data?.data?.salary?.max?.toLocaleString("en-IN")}</p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="flex flex-row gap-2 items-center">
              <MapPin />
              <span>{getJob?.data.data.jobLocation}</span>
            </div>
          </div>
        </CardBody>
        <CardFooter className="flex flex-row items-center w-full justify-between">
          <div className="flex flex-row gap-4 items-center">
            <p>Posted {getTimeAgo(getJob?.data?.data?.createdAt)}</p>
            <p>{getJob?.data?.data?.applicants.length} Applicants</p>
          </div>
          {/* <div className="flex flex-row items-center gap-2">
            {getJob?<div className="flex flex-row items-center gap-2">
                        {getJob?.data?.data?.applicants.includes(userData._id) ? (
                          <span className="text-green-600 font-semibold">
                            Already Applied
                          </span>
                        ) : (
                          <Button
                            onPress={() => applyForJob.mutate({})}
                            className="rounded-full"
                            color="primary"
                          >
                            Apply
                          </Button>
                        )}
                      </div>.data?.data?.applicants.includes(userData._id) ? (
              <span className="text-green-600 font-semibold">
                Already Applied
              </span>
            ) : (
              <Button
                onPress={() => applyForJob.mutate({})}
                className="rounded-full"
                color="primary"
              >
                Apply
              </Button>
            )}
          </div> */}
        </CardFooter>
      </Card>
      <p>{getJob?.data?.data?.description}</p>
    </div>
  );
}
