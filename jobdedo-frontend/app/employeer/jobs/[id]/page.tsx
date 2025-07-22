"use client";
import { queryClient } from "@/app/providers";
import BomLoadingCardSkeleton from "@/components/Card/BomLoadingCard";
import { getData, putData } from "@/core/api/apiHandler";
import { jobRoutes } from "@/core/api/apiRoutes";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
  Avatar,
  Link,
  Chip,
} from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  CalendarClock,
  IndianRupee,
  MapPin,
  XCircle,
} from "lucide-react";
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
  const {
    data: getJobCandidates,
    isFetched: isFetchedCandidates,
    isFetching: isFetchingCandidates,
  } = useQuery({
    queryKey: ["getJobCandidates", id],
    queryFn: () => {
      return getData(`${jobRoutes.getCandidates}${id}`, {});
    },
  });

  const updateResume = useMutation({
    mutationKey: ["updateResume", id],
    mutationFn: (data: any) => {
      return putData(`${jobRoutes.updateResumeStatus}${id}`, {}, data);
    },
  });

  const profileData: any = queryClient.getQueryData(["getProfile"]);

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

  const generateButton = (checkId: any) => {
    const progressList = getJob?.data?.data?.progress;
    if (!progressList || progressList.length === 0) return false;

    return progressList.some(
      (p: any) => p.appliedBy === checkId && p.progress === "resume_viewed",
    );
  };

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
            <p className="text-start font-semibold bg-white">
              {getJob?.data?.data?.applicants.length} Applicant{" "}
              {getJob?.data?.data?.applicants.length <= 1 ? "" : "s"}
            </p>
          </div>
        </CardFooter>
      </Card>
      <div className="flex flex-col bg-white w-3/4 p-10  rounded-xl gap-4 justify-start items-start">
        <p>{getJob?.data?.data?.description}</p>
      </div>
      <div className="flex flex-col gap-4 w-full items-center">
        <h1 className="flex font-bold justify-start items-start w-3/4">
          Applicants Applied
        </h1>
        {Array.isArray(getJobCandidates?.data?.data?.applicants) &&
        getJobCandidates.data.data.applicants.length > 0 ? (
          <div className="flex flex-col gap-4 w-3/4 p-6 rounded-xl">
            {getJobCandidates?.data?.data?.applicants.map(
              (applicant: any, index: number) => {
                return (
                  <Card key={applicant._id}>
                    <CardBody className="flex flex-row items-center justify-between w-full">
                      <div className="flex flex-row items-center justify-between gap-4">
                        <Avatar
                          src={applicant.profile_image}
                          name={applicant.name}
                          className="w-[100px] h-[100px]"
                        />
                        <div className="flex flex-col items-center">
                          <h1 className="font-bold text-gray-700 text-start w-full text-lg">
                            {applicant.name}
                          </h1>
                          <div className="flex flex-row gap-4 items-center">
                            <Chip color="primary">
                              {applicant.experinces.length} Experiences
                            </Chip>
                            <Chip color="secondary">
                              {applicant.education.length} Education
                            </Chip>
                            <Chip color="primary">
                              {applicant.language.length} Languages
                            </Chip>
                          </div>
                        </div>
                      </div>
                      {generateButton(applicant._id) ? (
                        <div className="flex flex-col  gap-4 items-center">
                          <Link
                            color="primary"
                            href={applicant.resume_link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            View Resume
                          </Link>
                          <div className="flex flex-row gap-2 items-center">
                            <Button
                              variant="ghost"
                              //   onClick={() => scheduleInterview(applicant._id)}
                              className="flex text-green-600 items-center gap-2"
                            >
                              <CalendarClock size={16} />
                              Schedule Interview
                            </Button>

                            <Button
                              variant="ghost"
                              //  onClick={() => rejectApplicant(applicant._id)}
                              className="flex items-center gap-2 text-red-600"
                            >
                              <XCircle size={16} />
                              Reject
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Link
                          color="primary"
                          href={applicant.resume_link}
                          target="_blank"
                          onPress={() => {
                            updateResume.mutate({
                              userId: applicant._id,
                            });
                          }}
                          rel="noopener noreferrer"
                        >
                          View Resume
                        </Link>
                      )}
                    </CardBody>
                  </Card>
                );
              },
            )}
          </div>
        ) : (
          <div className="bg-white w-3/4 p-4 rounded-xl text-center">
            <h1 className="text-lg font-semibold">No Applicants Applied</h1>
          </div>
        )}
      </div>
    </div>
  );
}
