import { queryClient } from "@/app/providers";
import { putData } from "@/core/api/apiHandler";
import { accountRoutes } from "@/core/api/apiRoutes";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Avatar,
  Button,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

export default function UserProfileDashboard({ userData }: any) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const updateProfile = useMutation({
    mutationKey: ["updateProfile"],
    mutationFn: (data: any) => {
      return putData(accountRoutes.addImageCandidate, {}, data);
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ["getProfile"] });
      toast.success("Updated User Profile Image", {
        position: "top-right",
      });
    },
    onError: (error: any) => {
      toast.error("Error while updating user", {
        position: "top-right",
      });
    },
  });
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: any) => {
    const formData = new FormData();

    if (selectedFile) {
      formData.append("images", selectedFile);
    }
    updateProfile.mutate(formData);
  };

  return (
    <Card className="w-[300px]">
      <CardHeader className="flex flex-col items-center">
        <label className="cursor-pointer" htmlFor="profile-image">
          <Avatar
            className="w-[200px] h-[200px]"
            name={userData?.name}
            src={userData?.profile_image ?? previewUrl ?? undefined}
            size="lg"
          />
        </label>
        <input
          id="profile-image"
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
        />
      </CardHeader>
      <CardBody>
        <div className="flex flex-col items-center justify-center">
          <h1>{userData?.name}</h1>
          <h1>{userData?.education[0]?.schoolName}</h1>
          <h1 className="flex flex-row gap-4 items-center">
            <span>
              {Math.floor(
                (new Date().getTime() -
                  new Date(userData?.updatedAt).getTime()) /
                  (1000 * 60 * 60 * 24),
              ) === 0
                ? "Today"
                : `${Math.floor(
                    (new Date().getTime() -
                      new Date(userData?.updatedAt).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )} days ago`}{" "}
            </span>
            <span>Updated</span>
          </h1>

          {selectedFile && (
            <Button onPress={(e) => handleSubmit(e)} type="submit">
              Submit
            </Button>
          )}
        </div>
      </CardBody>
      <CardFooter className="flex p-2 text-white flex-row gap-4 bg-blue-400 items-center w-full">
        <div className="flex flex-col items-center">
          <p>Search Appearances</p>
          <p>{userData?.searches}</p>
        </div>
        <div className="flex flex-col items-center">
          <p>Applied Jobs</p>
          <p>{userData?.applies}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
