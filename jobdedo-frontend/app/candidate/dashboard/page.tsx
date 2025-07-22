"use client";

import { queryClient } from "@/app/providers";
import UserProfileDashboard from "@/components/Card/UserProfileDashboard";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const profileData: any = queryClient.getQueryData(["getProfile"]);
  const menu = [
    {
      name: "Views Jobs",
      link: "/candidate/jobs/",
    },
    {
      name: "Applied Jobs",
      link: "/candidate/jobs/applied",
    },
  ];
  const handleMenuClick = (item: any) => {
    router.push(item.link);
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
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
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full px-6">
          <UserProfileDashboard userData={profileData?.data?.data} />
        </div>
      </div>
    </div>
  );
}
