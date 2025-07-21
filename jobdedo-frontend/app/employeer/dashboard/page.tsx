"use client";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const menu = [
    { name: "Dashboard", link: "/employeer/dashboard" },
    { name: "Create Job", link: "/employeer/jobs/create" },
    { name: "Jobs Created", link: "/employeer/jobs/" },
    { name: "Settings", link: "/settings" },
  ];

  return (
    <div className="flex w-1/3 flex-row items-center justify-center space-x-6 bg-gray-100 p-4 rounded shadow">
      {menu.map((m: any, index: number) => (
        <a
          key={index}
          href={m.link}
          className="text-lg cursor-pointer hover:text-blue-600 transition"
        >
          {m.name}
        </a>
      ))}
    </div>
  );
}
