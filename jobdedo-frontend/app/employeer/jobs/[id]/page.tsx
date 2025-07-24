"use client";
import { queryClient } from "@/app/providers";
import BomLoadingCardSkeleton from "@/components/Card/BomLoadingCard";
import CustomModal from "@/components/Modal/CustomModal";
import { getData, postData, putData } from "@/core/api/apiHandler";
import { accountRoutes, jobRoutes } from "@/core/api/apiRoutes";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Button,
  Avatar,
  Link,
  Input,
  Chip,
  Select,
  SelectItem,
  useDisclosure,
  TimeInput,
} from "@heroui/react";
import { Time } from "@internationalized/date";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Briefcase,
  CalendarClock,
  IndianRupee,
  MapPin,
  XCircle,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function SingleJob() {
  const { id } = useParams();

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const {
    isOpen: isOpenInterview,
    onOpen: onOpenInterview,
    onOpenChange: onOpenChangeInterview,
    onClose: onCloseInterview,
  } = useDisclosure();

  const [interviewData, setInterviewData] = useState<any>({});

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
  const [userId, setUserId] = useState<any>(null);

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

  const {
    data: getCompanyEmployees,
    isFetched: isFetchedCompanyEmployees,
    isFetching: isFetchingCompanyEmployees,
  } = useQuery({
    queryKey: ["getCompanyEmployees", id],
    queryFn: () => {
      return getData(`${accountRoutes.getEmployess}`, {});
    },
  });

  const profileData: any = queryClient.getQueryData(["getProfile"]);

  const [interview, setInterview] = useState<any>({
    attendies: [],
  });

  const createInterview = useMutation({
    mutationKey: ["createInterview", id],
    mutationFn: (data: any) => {
      return postData(`${jobRoutes.createInterview}${id}`, {}, { data });
    },
    onSuccess: (data: any) => {
      console.log(data, "once");
      toast.success("Interview Added", {
        position: "top-right",
      });
      queryClient.invalidateQueries();
      setInterview({
        attendies: [],
      });
      onClose();
    },
    onError: (error: any) => {
      console.log(error, "Error");
    },
  });

  const handleSet = (key: string, value: any) => {
    console.log(interview, "interview");
    setInterview((prev: any) => {
      if ((key === "startTime" || key === "endTime") && prev.interviewDate) {
        const date = new Date(prev.interviewDate);
        date.setHours(value.hour);
        date.setMinutes(value.minute);
        date.setSeconds(0);
        date.setMilliseconds(0);

        return {
          ...prev,
          [key]: date,
        };
      }

      if (key === "attendies") {
        let updatedAttendies = [...prev.attendies];

        if (updatedAttendies.length >= 1) {
          console.log(updatedAttendies);
          updatedAttendies.pop();
        }

        updatedAttendies.push(value);

        return {
          ...prev,
          attendies: updatedAttendies,
        };
      }

      return {
        ...prev,
        [key]: key === "interviewDate" ? new Date(value) : value,
      };
    });
  };
  console.log(userId, "id");
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const updatedAttendies = interview.attendies?.includes(userId)
      ? interview.attendies
      : [...(interview.attendies || []), userId];

    const updated = {
      ...interview,
      attendies: updatedAttendies,
    };

    setInterview(updated);

    createInterview.mutate({
      ...updated,
      userId,
    });
  };

  const updateResume = useMutation({
    mutationKey: ["updateResume", id],
    mutationFn: (data: any) => {
      return putData(`${jobRoutes.updateResumeStatus}${id}`, {}, data);
    },
  });

  const rejectCandidate = useMutation({
    mutationKey: ["rejectCandidate", id],
    mutationFn: (data: any) => {
      return putData(
        `${jobRoutes.rejectCanidate}${id}`,
        {},
        {
          data,
        },
      );
    },
    onSuccess: (data: any) => {
      toast.success("Rejected Candidate", {
        position: "top-right",
      });
      queryClient.invalidateQueries();
    },
    onError: (error: any) => {
      console.log(error, "Error");
      toast.error("Error while Rejecting Candidate", {
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

  const getProgressStatusTwo = (applicantId: string) => {
    const progressList = getJob?.data?.data?.progress;
    if (!Array.isArray(progressList) || progressList.length === 0) return null;

    // Filter all progress entries for this applicant
    const applicantProgress = progressList.filter(
      (p: any) => p.appliedBy === applicantId,
    );

    // Get the last one, if any
    const lastEntry = applicantProgress[applicantProgress.length - 1];

    return lastEntry ?? null;
  };

  if (isFetching && isFetchingCandidates) {
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
                      {(() => {
                        const status = getProgressStatusTwo(applicant._id);

                        if (status?.progress === "applied") {
                          return (
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
                          );
                        } else if (status?.progress === "interview_added") {
                          return (
                            <div className="flex flex-col items-center gap-4">
                              <Button
                                startContent={<CalendarClock />}
                                color="primary"
                                variant="shadow"
                                onPress={() => {
                                  setInterviewData(
                                    status.interviews[
                                      status.interviews.length - 1
                                    ],
                                  );
                                  onOpenInterview();
                                }}
                              >
                                Sceduled Interview
                              </Button>
                            </div>
                          );
                        } else if (status?.progress === "resume_viewed") {
                          return (
                            <div
                              key={applicant._id}
                              className="flex flex-col  gap-4 items-center"
                            >
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
                                  onClick={() => {
                                    setUserId(applicant._id);
                                    onOpen();
                                  }}
                                  className="flex text-green-600 items-center gap-2"
                                >
                                  <CalendarClock size={16} />
                                  Schedule Interview
                                </Button>

                                <Button
                                  variant="ghost"
                                  onClick={() =>
                                    rejectCandidate.mutate({
                                      userId: applicant._id,
                                    })
                                  }
                                  className="flex items-center gap-2 text-red-600"
                                >
                                  <XCircle size={16} />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          );
                        } else if (status?.progress === "rejected") {
                          return (
                            <div className="flex items-center gap-2 text-red-600 bg-red-100 border border-red-300 px-4 py-2 rounded-lg shadow-sm">
                              <svg
                                className="w-5 h-5 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                              <span className="font-semibold">
                                Application Rejected
                              </span>
                            </div>
                          );
                        }
                      })()}
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

      <CustomModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        heading="Schedule Interview"
        bottomContent={
          <div className="flex flex-row items-center">
            <Button color="danger" onPress={() => onClose()}>
              Close
            </Button>
          </div>
        }
      >
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="flex flex-col gap-4 p-4 items-center"
        >
          <Input
            label="Date for Interview"
            onValueChange={(e) => handleSet("interviewDate", e)}
            type="date"
          />
          {interview.interviewDate && (
            <>
              <TimeInput
                onChange={(e) => handleSet("startTime", e)}
                label="Start Time"
              />
              <TimeInput
                onChange={(e) => handleSet("endTime", e)}
                label="End Time"
              />
            </>
          )}

          <Select
            isRequired
            onChange={(e: any) => handleSet("attendies", e.target.value)}
            className="max-w-xl"
            label="Select Interviewer"
            placeholder="Select Interviewer"
          >
            {getCompanyEmployees?.data?.data?.map((animal: any) => (
              <SelectItem key={animal._id}>{animal.name}</SelectItem>
            ))}
          </Select>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </form>
      </CustomModal>
      <CustomModal
        isOpen={isOpenInterview}
        onOpenChange={onOpenChangeInterview}
        bottomContent={
          <div className="flex flex-col items-center">
            <Button color="danger">Close</Button>
          </div>
        }
        heading="Interview Details"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-blue-400 font-bold text-md">Attendies</h1>
            <div className="flex flex-row flex-wrap gap-4">
              {interviewData?.attendies?.map((attendie: any, index: any) => (
                <Chip color="primary" key={index}>
                  {attendie.name}
                </Chip>
              ))}
            </div>
          </div>
          <div className="flex flex-row items-center gap-4">
            <h1>Interview Date</h1>
            <h1>
              {new Date(interviewData?.interviewDate).toLocaleDateString()}
            </h1>
          </div>
          <div className="flex flex-row items-center gap-4">
            <div className="flex flex-col items-start">
              <h1 className="font-semibold">
                {new Date(interviewData?.startTime)
                  .getHours()
                  .toString()
                  .padStart(2, "0")}
                :
                {new Date(interviewData?.startTime)
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}
              </h1>
              <p className="text-sm text-gray-600">Start Time</p>
            </div>

            <div className="flex flex-col items-start">
              <h1 className="font-semibold">
                {new Date(interviewData?.endTime)
                  .getHours()
                  .toString()
                  .padStart(2, "0")}
                :
                {new Date(interviewData?.endTime)
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}
              </h1>
              <p className="text-sm text-gray-600">End Time</p>
            </div>
          </div>
        </div>
      </CustomModal>
    </div>
  );
}
