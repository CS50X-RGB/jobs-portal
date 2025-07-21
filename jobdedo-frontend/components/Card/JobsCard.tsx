import { Card, CardBody, CardHeader } from "@heroui/react";
import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function JobsCard({ jobData }: any) {
  const router = useRouter();

  return (
    <Card
      isPressable
      onPress={() => router.push(`/candidate/jobs/${jobData._id}`)}
      className="flex flex-col w-[400px]"
    >
      <CardHeader className="flex flex-row items-center w-full  gap-4 font-bold text-xl px-10">
        <p>{jobData.title}</p>
        <p className="text-sm text-gray-500">
          Posted {getTimeAgo(jobData.createdAt)}
        </p>
      </CardHeader>
      <CardBody className="flex flex-col gap-4 px-10">
        <div className="text-lg font-medium">{jobData.company.name}</div>
        <div className="flex flex-row items-center gap-2 text-gray-600">
          <MapPin size={20} />
          <span>{jobData.jobLocation}</span>
        </div>
      </CardBody>
    </Card>
  );
}
