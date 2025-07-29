"use client";
import { queryClient } from "@/app/providers";
import CompanyCard from "@/components/Card/CompanyCard";
import PolarAreaWrapper from "@/components/Graphs/PolarArea";
import { getData } from "@/core/api/apiHandler";
import { jobRoutes } from "@/core/api/apiRoutes";
import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const menu = [
    { name: "Dashboard", link: "/employeer/dashboard" },
    { name: "Create Job", link: "/employeer/jobs/create" },
    { name: "Jobs Created", link: "/employeer/jobs/" },
    // { name: "View Candidates", link: "/employeer/talent" },
  ];

  const profileData: any = queryClient.getQueryData(["getProfile"]);

  const {
    data: getInterviews,
    isFetched: isFetchedInterviews,
    isFetching: isFetchingInterviews,
  } = useQuery({
    queryKey: ["interviews"],
    queryFn: () => {
      return getData(jobRoutes.getMineInterviews, {});
    },
  });

  const {
    data: getCompanyJobs,
    isFetched: isFetchedCompanyJobs,
    isFetching: isFetchingCompanyJobs,
  } = useQuery({
    queryKey: ["companyjobs"],
    queryFn: () => {
      return getData(jobRoutes.getMyCompanyJobs, {});
    },
  });

  const {
    data: jobDistribution,
    isFetched: isFetchedJobsDistribution,
    isFetching: isFetchingJobsDistribution,
  } = useQuery({
    queryKey: ["jobsDistribution"],
    queryFn: () => {
      return getData(jobRoutes.getCompanyDistribution, {});
    },
  });

  function generateGoogleCalendarUrl({
    title,
    interviewDate,
    startTime,
    endTime,
    description = "",
    location = "",
  }: {
    title: string;
    interviewDate: string;
    startTime: string;
    endTime: string;
    description?: string;
    location?: string;
  }) {
    const date = new Date(interviewDate);

    const start = new Date(startTime);
    const end = new Date(endTime);

    const startDateTime = new Date(date);
    startDateTime.setHours(start.getHours(), start.getMinutes(), 0);

    const endDateTime = new Date(date);
    endDateTime.setHours(end.getHours(), end.getMinutes(), 0);
    const formatDate = (d: Date) =>
      d.toISOString().replace("/[-:]/g", "").replace("/\.\d{3}/", "");

    const formattedStart = formatDate(startDateTime);
    const formattedEnd = formatDate(endDateTime);

    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: title,
      dates: `${formattedStart}/${formattedEnd}`,
      details: description,
      location,
    });

    return `https://www.google.com/calendar/render?${params.toString()}`;
  }

  const handleMenuClick = (item: any) => {
    router.push(item.link);
  };

  return (
    <div className="flex flex-row justify-between w-full">
      <div className="flex flex-col items-center gap-4 p-4">
        <div className="w-64 bg-gray-100 border-r p-4">
          <h2 className="text-lg font-semibold mb-4">Menu</h2>
          <ul className="space-y-2">
            {menu.map((item: any, index: number) => (
              <li key={index}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className="w-full text-left px-4 py-2 rounded hover:bg-gray-200"
                >
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <CompanyCard companyInfo={profileData.data.data.company} count={10} />
      </div>
      {jobDistribution && jobDistribution.data.data && (
        <div className="flex flex-col items-start">
          <Card className="w-full">
            <CardHeader className="text-blue-500 font-bold">
              Job Creation By Employee Distribution
            </CardHeader>
            <CardBody>
              <PolarAreaWrapper data={jobDistribution?.data?.data} />
            </CardBody>
          </Card>
        </div>
      )}
      <div className="flex flex-col rounded-sm bg-white p-5 items-center gap-4">
        <h1 className="font-bold text-start text-xl text-blue-400 ">
          Upcoming Interviews
        </h1>
        {getInterviews?.data.data.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-4">
            No interviews right now
          </div>
        ) : (
          getInterviews?.data?.data?.map((interview: any, index: any) => {
            const calendarUrl = generateGoogleCalendarUrl({
              title: interview.jobId.title,
              interviewDate: interview.interviewDate,
              startTime: interview.startTime,
              endTime: interview.endTime,
              description: "Bring your resume and portfolio.",
              location: "https://meet.google.com/xyz-abc",
            });

            return (
              <Card key={interview._id}>
                <CardHeader>{interview.jobId.title}</CardHeader>
                <CardBody className="flex flex-col gap-4">
                  <Chip color="primary">{interview.companyId.name}</Chip>
                  <h1>
                    Interview On :{" "}
                    {new Date(interview.interviewDate).toLocaleDateString()}
                  </h1>
                  <div className="flex items-center gap-4">
                    <h1>
                      From{" "}
                      {new Date(interview.startTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </h1>
                    <h1>
                      To{" "}
                      {new Date(interview.endTime).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </h1>
                  </div>
                </CardBody>
                <CardFooter>
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2"
                  >
                    <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                      Add to Google Calendar
                    </button>
                  </a>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
