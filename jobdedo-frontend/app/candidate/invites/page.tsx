"use client";

import { queryClient } from "@/app/providers";
import BomLoadingCardSkeleton from "@/components/Card/BomLoadingCard";
import { getData, putData } from "@/core/api/apiHandler";
import { jobRoutes } from "@/core/api/apiRoutes";
import { Button, Card, CardBody } from "@heroui/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function InvitePage() {
  const router = useRouter();

  const { data: getInvites, isFetching } = useQuery({
    queryKey: ["getInvites"],
    queryFn: () => getData(jobRoutes.getFullInviteObjects, {}),
  });

  const updateInvite = useMutation({
    mutationKey: ["updateInvite"],
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      putData(`${jobRoutes.updateInvite}${id}`, {}, { data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getCountInvites"] });
    },
  });

  if (isFetching) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <BomLoadingCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center p-10 w-3/4">
      <h1 className="text-2xl text-start font-bold">Invites</h1>
      {getInvites?.data?.data?.map((invite: any, index: number) => {
        const isNew = invite.viewed === false;

        return (
          <Card
            key={index}
            className={`w-full my-2 ${
              isNew ? "border-l-4 border-blue-500 bg-blue-50" : ""
            }`}
          >
            <CardBody>
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-md font-semibold">
                    {invite.employee.name} has invited for {invite.jobId.title}{" "}
                    from {invite.employee.company.name}
                  </h1>
                  {isNew && (
                    <p className="text-xs text-blue-500 mt-1">New Invite</p>
                  )}
                </div>
                {isNew && (
                  <div className="flex flex-row items-center gap-4 p-4">
                    <Button
                      size="sm"
                      color="danger"
                      variant="flat"
                      onPress={(e) => {
                        updateInvite.mutate({
                          id: invite._id,
                          data: { status: "invite_rejected" },
                        });
                      }}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      color="success"
                      variant="flat"
                      onPress={(e) => {
                        updateInvite.mutate({
                          id: invite._id,
                          data: { status: "invite_viewed" },
                        });
                        router.push(`/candidate/jobs/${invite.jobId._id}`);
                      }}
                    >
                      Accept
                    </Button>
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        );
      })}
    </div>
  );
}
