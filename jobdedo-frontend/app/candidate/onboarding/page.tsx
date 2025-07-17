"use client";
import CustomModal from "@/components/Modal/CustomModal";
import { educationType, langLevel } from "@/content/selectData";
import { putData } from "@/core/api/apiHandler";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Card,
  CardBody,
  CardHeader,
  Select,
  SelectItem,
  useDisclosure,
  Chip,
} from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { accountRoutes } from "@/core/api/apiRoutes";
import { queryClient } from "@/app/providers";
import { toast } from "sonner";

export default function CandidateOnboarding() {
  const {
    onOpen: onOpenLang,
    onOpenChange: onOpenChangeLang,
    isOpen: isOpenLang,
    onClose: onCloseLang,
  } = useDisclosure();
  const {
    onOpen: onOpenEducation,
    onOpenChange: onOpenChangeEducation,
    isOpen: isOpenEducation,
    onClose: onCloseEducation,
  } = useDisclosure();

  const [skillInput, setSkillInput] = useState("");

  const profileData: any = queryClient.getQueryData(["getProfile"]);

  const addLang = useMutation({
    mutationKey: ["addLang"],
    mutationFn: (data: any) => {
      return putData(
        accountRoutes.addLang,
        {},
        {
          data,
        },
      );
    },
    onSuccess: (data: any) => {
      console.log(data.data, "user");
      queryClient.invalidateQueries({ queryKey: ["getProfile"] });
      toast.success("Added Language Successfully", {
        position: "top-right",
      });
    },
    onError: (error: any) => {
      toast.error("Error while adding Language", {
        position: "top-right",
      });
    },
  });

  const addEducation = useMutation({
    mutationKey: ["addEducation"],
    mutationFn: (data: any) => {
      return putData(
        accountRoutes.addEducation,
        {},
        {
          data,
        },
      );
    },
    onSuccess: (data: any) => {
      console.log(data.data, "user");
      queryClient.invalidateQueries({ queryKey: ["getProfile"] });
      toast.success("Added Education Successfully", {
        position: "top-right",
      });
      onCloseEducation();
    },
    onError: (error: any) => {
      console.log(error, "error");
      toast.error("Error while adding Education", {
        position: "top-right",
      });
    },
  });

  const [education, setEducation] = useState<any>({});
  const [lang, setLang] = useState<any>({});
  const [user, setUser] = useState<any>({});

  const handleSet = (
    type: "education" | "lang" | "user",
    key: any,
    value: any,
  ) => {
    if (type === "education") {
      setEducation((prev: any) => ({
        ...prev,
        [key]:
          key === "startDate" || key === "endDate" ? new Date(value) : value,
      }));
    } else if (type === "lang") {
      setLang((prev: any) => ({
        ...prev,
        [key]: value,
      }));
    } else if (type === "user") {
      setUser((prev: any) => ({
        ...prev,
        [key]:
          key === "dob"
            ? new Date(value)
            : key === "skills"
              ? [...(prev.skills || []), value]
              : value,
      }));
    }
  };
  const removeSkill = (skillToRemove: string) => {
    setUser((prev: any) => ({
      ...prev,
      skills: prev.skills.filter((s: string) => s !== skillToRemove),
    }));
  };

  const handleSubmit = (e: any, type: "education" | "lang") => {
    e.preventDefault();
    if (type === "education") {
      addEducation.mutate(education);
    } else if (type === "lang") {
      addLang.mutate(lang);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-4 items-center w-full">
        <form className="flex flex-col gap-4 items-center w-full p-5">
          <div className="flex flex-row items-start gap-2 w-2/3">
            <Input
              type="date"
              onValueChange={(e) => handleSet("user", "dob", e)}
              label="Date of Birth"
            />
            <Input
              onValueChange={(e) => handleSet("user", "phoneno", e)}
              type="tel"
              label="Phone No"
            />
          </div>
          <div className="flex flex-col items-start gap-2 w-full">
            <Button onPress={onOpenEducation} color="primary" variant="flat">
              Add Education
            </Button>
            <div className="flex flex-col items-center flex-wrap gap-4">
              {profileData.data.data.education.length > 0 &&
                profileData.data.data.education.map(
                  (data: any, index: number) => (
                    <Card
                      key={index}
                      className="w-full max-w-xl mx-auto my-4 shadow-lg rounded-2xl border"
                    >
                      <CardHeader className="p-4 border-b">
                        <div className="flex flex-col gap-2">
                          <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold uppercase">
                              {data.schoolName}
                            </h3>
                            <span className="text-sm text-gray-600">
                              {data.result}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <Chip className="uppercase" color="primary">
                              {data.type}
                            </Chip>
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody className="p-4">
                        <div className="flex justify-between gap-4 text-sm text-gray-700">
                          <p>
                            <span className="font-medium">Start:</span>{" "}
                            {new Date(data.startDate).toLocaleDateString(
                              "en-IN",
                            )}
                          </p>
                          <p>
                            <span className="font-medium">End:</span>{" "}
                            {new Date(data.endDate).toLocaleDateString("en-IN")}
                          </p>
                        </div>
                      </CardBody>
                    </Card>
                  ),
                )}
            </div>
          </div>
          <div className="flex flex-col items-start gap-2 w-full">
            <Button onPress={onOpenLang} color="primary" variant="flat">
              Add Langauge
            </Button>
            <div className="flex flex-row items-center flex-wrap gap-4">
              {profileData.data.data.language.length > 0 &&
                profileData.data.data.language.map(
                  (data: any, index: number) => (
                    <div key={index}>
                      <Card className="w-full">
                        <CardHeader className="flex flex-col gap-2 items-center w-full">
                          <Chip className="uppercase font-bold">
                            {data.name}
                          </Chip>
                          <div className="flex flex-row gap-2 items-center">
                            <p className="font-bold text-md">Proffeciney</p>
                            <Chip className="uppercase" color="primary">
                              {data.levels}
                            </Chip>
                          </div>
                        </CardHeader>
                      </Card>
                    </div>
                  ),
                )}
            </div>
          </div>
          <div className="flex flex-col justify-start items-start w-full gap-2">
            <div className="flex items-center flex-wrap gap-4">
              {user.skills &&
                user?.skills.length > 0 &&
                user.skills.map((s: any, index: number) => (
                  <Chip
                    color="secondary"
                    key={index}
                    onClose={() => removeSkill(s)}
                    variant="flat"
                  >
                    {s}
                  </Chip>
                ))}
            </div>
            <div className="flex flex-row items-center w-2/3 gap-4">
              <Input
                value={skillInput}
                onValueChange={setSkillInput}
                label="Skill"
                className="w-full"
              />
              <Button
                color="primary"
                onPress={() => {
                  if (skillInput.trim()) {
                    handleSet("user", "skills", skillInput.trim());
                    setSkillInput("");
                  }
                }}
              >
                Add Skill
              </Button>
            </div>
          </div>
        </form>
      </div>
      <CustomModal
        isOpen={isOpenEducation}
        onOpenChange={onOpenChangeEducation}
        heading="Add Education"
        bottomContent={
          <div className="flex flex-row items-center w-full">
            <Button color="danger">Close</Button>
          </div>
        }
      >
        <form
          onSubmit={(e: any) => handleSubmit(e, "education")}
          className="flex flex-col items-center w-full gap-4"
        >
          <Select
            isRequired
            onChange={(e: any) =>
              handleSet("education", "type", e.target.value)
            }
            className="max-w-xl"
            label="Education Type"
            placeholder="Select Education"
          >
            {educationType.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>
          <Input
            type="text"
            label="School Name"
            onValueChange={(e) => handleSet("education", "schoolName", e)}
            isRequired
          />
          <Input
            type="date"
            onValueChange={(e) => handleSet("education", "startDate", e)}
            label="Start Date"
            isRequired
          />
          <Input
            type="text"
            label="Perctage or CGPA"
            onValueChange={(e) => handleSet("education", "result", e)}
            isRequired
          />
          <Input
            type="date"
            onValueChange={(e) => handleSet("education", "endDate", e)}
            label="End Date"
          />
          <Button className="w-full" type="submit" color="primary">
            Submit
          </Button>
        </form>
      </CustomModal>
      <CustomModal
        isOpen={isOpenLang}
        onOpenChange={onOpenChangeLang}
        heading="Add Language"
        bottomContent={
          <div className="flex flex-row items-center w-full">
            <Button color="danger">Close</Button>
          </div>
        }
      >
        <form
          onSubmit={(e: any) => handleSubmit(e, "lang")}
          className="flex flex-col items-center w-full gap-4"
        >
          <Input
            type="text"
            label="Language Name"
            onValueChange={(e) => handleSet("lang", "name", e)}
            isRequired
          />
          <Select
            isRequired
            onChange={(e: any) => {
              console.log(e.target.value);
              handleSet("lang", "levels", e.target.value);
            }}
            className="max-w-xl"
            label="Language Proffeciney"
            placeholder="Select Language"
          >
            {langLevel.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>
          <Button className="w-full" type="submit" color="primary">
            Submit
          </Button>
        </form>
      </CustomModal>
    </>
  );
}
