"use client";
import BomLoadingCardSkeleton from "@/components/Card/BomLoadingCard";
import { getData } from "@/core/api/apiHandler";
import { accountRoutes } from "@/core/api/apiRoutes";
import { Avatar, Card, CardBody, CardHeader, Chip, Link } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";

export default function Talent() {
  const {
    data: usersWithResume,
    isFetched,
    isFetching,
  } = useQuery({
    queryKey: ["usersWithResume"],
    queryFn: () => {
      return getData(accountRoutes.candidatesWithResume, {});
    },
  });

  console.log(usersWithResume?.data.data);

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center w-3/4 p-5">
        {Array.from({ length: 5 }).map((_, index: number) => (
          <BomLoadingCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (usersWithResume?.data?.data?.length === 0) {
    return <h1 className="text-gray-400 text-center">No Users are found</h1>;
  } else {
    return (
      <div className="flex flex-col justify-start gap-4 w-full items-center">
        {usersWithResume?.data?.data.map((d: any) => (
          <Card key={d._id}>
            <CardBody className="flex flex-row items-center justify-between w-full">
              <div className="flex flex-row items-center justify-between gap-4">
                <Avatar
                  src={d.profile_image}
                  name={d.name}
                  className="w-[100px] h-[100px]"
                />
                <div className="flex flex-col items-center">
                  <h1 className="font-bold text-gray-700 text-start w-full text-lg">
                    {d.name}
                  </h1>
                  <div className="flex flex-row gap-4 items-center">
                    <Chip color="primary">
                      {d.experinces.length} Experiences
                    </Chip>
                    <Chip color="secondary">
                      {d.education.length} Education
                    </Chip>
                    <Chip color="primary">{d.language.length} Languages</Chip>
                  </div>
                </div>
                {d.resume_link && (
                  <a
                    href={d.resume_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline text-sm"
                  >
                    📄 View Resume
                  </a>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }
}
