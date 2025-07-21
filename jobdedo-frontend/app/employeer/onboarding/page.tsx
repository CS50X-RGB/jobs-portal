"use client";
import { Input, Textarea } from "@heroui/input";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { toast } from "sonner";
import { accountRoutes } from "@/core/api/apiRoutes";
import { useAsyncList } from "@react-stately/data";
import { getData, postData, putData } from "@/core/api/apiHandler";
import CustomModal from "@/components/Modal/CustomModal";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/app/providers";

export default function OnBoarding() {
  const {
    onOpen: onOpenComapny,
    onOpenChange: onOpenChangeCompany,
    isOpen: isOpenCompany,
    onClose: onCloseComapny,
  } = useDisclosure();

  const [company, setCompany] = useState<any>({});
  const [user, setUser] = useState<any>({});
  const [skillInput, setSkillInput] = useState<any>("");
  const [loadingUser, setloadingUser] = useState<boolean>(false);
  const [selectedCompany, setSelectedCompany] = useState<any>("");

  const updateUser = useMutation({
    mutationKey: ["updateUserAny"],
    mutationFn: async (item: any) => {
      return await putData(`${accountRoutes.updateMineUser}`, {}, item);
    },
    onMutate: () => {
      setloadingUser(true);
    },
    onSettled: () => {
      setloadingUser(false);
    },
    onSuccess: (data: any) => {
      setloadingUser(false);
      toast.success("User Details update", {
        position: "top-right",
      });
    },
    onError: (err: any) => {
      console.error(err, "Error");
    },
  });

  const addCompany = useMutation({
    mutationKey: ["addCompany"],
    mutationFn: (data: any) => {
      return postData(
        accountRoutes.addCompany,
        {},
        {
          data,
        },
      );
    },
    onSuccess: (data: any) => {
      console.log(data, "success");
      toast.success("Company Added", {
        position: "top-right",
      });
      onCloseComapny();
    },
    onError: (error: any) => {
      console.log(error, "error");
      toast.error("Company Addition Error", {
        position: "top-right",
      });
    },
  });

  const handleSet = (key: any, value: any, type: "company" | "user") => {
    if (type === "company") {
      setCompany((prev: any) => ({
        ...prev,
        [key]:
          key === "foundationDate"
            ? new Date(value)
            : key === "categories"
              ? [...(prev.categories || []), value]
              : value,
      }));
    } else if (type === "user") {
      setUser((prev: any) => ({
        ...prev,
        [key]: key === "dob" ? new Date(value) : value,
      }));
    }
  };

  const levelsSelect: { label: string; key: string }[] = [
    {
      key: "0-10",
      label: "STARTUP",
    },
    {
      key: "10-50",
      label: "INTERMEDIATE",
    },
    {
      key: "50-500",
      label: "MIDLEVEL",
    },
    {
      key: "500+",
      label: "BIGLEVEL",
    },
  ];

  const list = useAsyncList({
    async load({ filterText }) {
      try {
        const res = await getData(
          `${accountRoutes.getCompanies}?search=${filterText}`,
          {},
        );

        if (!Array.isArray(res.data.data)) {
          console.error("Expected json.data to be an array", res.data.data);
          return { items: [] };
        }
        let items = [...res.data.data];

        if (!items.find((item) => item._id === "other")) {
          items.push({ _id: "other", name: "Others" });
        }

        return {
          items,
        };
      } catch (err) {
        console.error("Error fetching autocomplete data:", err);
        return { items: [] };
      }
    },
  });

  const removeSkill = (skillToRemove: string) => {
    setCompany((prev: any) => ({
      ...prev,
      categories: prev.categories.filter((s: string) => s !== skillToRemove),
    }));
  };
  const profileData: any = queryClient.getQueryData(["getProfile"]);

  const handleSubmit = (e: any, type: "company" | "user") => {
    e.preventDefault();
    if (type == "company") {
      addCompany.mutate(company);
    } else if (type === "user") {
      updateUser.mutate(user);
    }
  };

  useEffect(() => {
    if (profileData?.data?.data?.dob) {
      handleSet("dob", profileData.data.data.dob, "user");
    }
    if (profileData?.data?.data?.phoneno) {
      handleSet("phoneno", profileData.data.data.phoneno, "user");
    }
    if (profileData?.data?.data?.company) {
      setSelectedCompany(profileData?.data?.data?.company?._id);
    }
  }, [profileData]);

  return (
    <>
      <div className="flex flex-col gap-4 items-center w-full">
        <form
          onSubmit={(e) => handleSubmit(e, "user")}
          className="flex flex-col gap-4 items-center w-full p-5"
        >
          <div className="flex flex-row items-start gap-2 w-2/3">
            <Input
              type="date"
              value={
                user.dob ? new Date(user.dob).toISOString().split("T")[0] : ""
              }
              onValueChange={(e) => handleSet("dob", e, "user")}
              label="Date of Birth"
            />

            <Input
              value={user.phoneno}
              onValueChange={(e) => handleSet("phoneno", e, "user")}
              type="tel"
              label="Phone No"
            />
          </div>
          <div className="flex flex-col w-full items-center gap-4 justify-around">
            <Autocomplete
              className="max-w-xl"
              inputValue={list.filterText}
              isLoading={list.isLoading}
              items={list.items ?? []}
              selectedKey={selectedCompany?.toString() ?? ""}
              isRequired
              onSelectionChange={(e) => {
                if (e === "other") {
                  onOpenComapny();
                }
              }}
              label={"Select Company"}
              variant="bordered"
              onInputChange={list.setFilterText}
            >
              {(item: any) => (
                <AutocompleteItem key={item._id} className="capitalize">
                  {item.name}
                </AutocompleteItem>
              )}
            </Autocomplete>
            {profileData?.data?.data?.company && (
              <Card className="w-2/3">
                <CardHeader className="font-bold text-xl">
                  {profileData?.data?.data?.company?.name}
                </CardHeader>
                <CardBody className="flex flex-col items-start gap-4 justify-between">
                  <p>{profileData?.data?.data?.company?.description}</p>
                  <div className="flex flex-row gap-4 items-center">
                    <p>
                      Foundation Date:{" "}
                      {profileData?.data?.data?.company?.foundationDate
                        ? (() => {
                            const foundation = new Date(
                              profileData.data.data.company.foundationDate,
                            );
                            const today = new Date();

                            let yearDiff =
                              today.getFullYear() - foundation.getFullYear();
                            const hasAnniversaryPassed =
                              today.getMonth() > foundation.getMonth() ||
                              (today.getMonth() === foundation.getMonth() &&
                                today.getDate() >= foundation.getDate());

                            if (!hasAnniversaryPassed) {
                              yearDiff--;
                            }

                            return `${foundation.toLocaleDateString()} (${yearDiff} year${yearDiff !== 1 ? "s" : ""} ago)`;
                          })()
                        : "N/A"}
                    </p>
                    <Chip color="primary">
                      {profileData?.data?.data?.company?.level} Employees
                    </Chip>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </form>
      </div>
      <CustomModal
        isOpen={isOpenCompany}
        onOpenChange={onOpenChangeCompany}
        heading="Create Comapny"
        bottomContent={
          <div className="flex flex-row items-center gap-4">
            <Button onPress={onCloseComapny} color="danger">
              Close
            </Button>
          </div>
        }
      >
        <form
          onSubmit={(e) => handleSubmit(e, "company")}
          className="flex flex-col gap-4 p-4"
        >
          <Input
            label="Comapny Name"
            onValueChange={(e) => handleSet("name", e, "company")}
            type="text"
          />
          <Input
            label="Start Date"
            onValueChange={(e) => handleSet("foundationDate", e, "company")}
            type="date"
          />
          <Textarea
            label="Description"
            onValueChange={(e) => handleSet("description", e, "company")}
            type="text"
          />
          <Select
            isRequired
            onChange={(e: any) => handleSet("level", e.target.value, "company")}
            className="max-w-xl"
            label="Company Type"
            placeholder="Select Company Type"
          >
            {levelsSelect.map((animal) => (
              <SelectItem key={animal.key}>{animal.label}</SelectItem>
            ))}
          </Select>
          <div className="flex items-center flex-wrap gap-4">
            {company.categories &&
              company?.categories.length > 0 &&
              company.categories.map((s: any, index: number) => (
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
          <div className="flex flex-row items-center w-full gap-4">
            <Input
              value={skillInput}
              onValueChange={setSkillInput}
              label="Add Category"
              className="w-full"
            />
            <Button
              color="primary"
              className="p-4"
              onPress={() => {
                if (skillInput.trim()) {
                  handleSet("categories", skillInput.trim(), "company");
                  setSkillInput("");
                }
              }}
            >
              Add Category
            </Button>
          </div>
          <Button type="submit" color="primary">
            Submit
          </Button>
        </form>
      </CustomModal>
    </>
  );
}
