"use client";

import { indianStates } from "@/content/selectData";
import { postData } from "@/core/api/apiHandler";
import { jobRoutes } from "@/core/api/apiRoutes";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/react";
import { Button } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CreateJob() {
  const [job, setJob] = useState<any>({
    experienceNeeded: { min: "", max: "" },
    salary: { min: 0, max: 0 },
  });

  const router = useRouter();

  const createJob = useMutation({
    mutationKey: ["createJob"],
    mutationFn: (data: any) => {
      return postData(
        jobRoutes.createJob,
        {},
        {
          data,
        },
      );
    },
    onSuccess: (data: any) => {
      toast.success("Job Added", {
        position: "top-right",
      });
      router.push("/employeer/dashboard");
    },
    onError: (error: any) => {
      toast.error("Job Curation Error", {
        position: "top-right",
      });
    },
  });

  const handleSet = (key: string, value: any) => {
    setJob((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    createJob.mutate(job);
  };

  const handleNestedSet = (parentKey: string, key: string, value: any) => {
    setJob((prev: any) => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [key]: value,
      },
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="w-full max-w-2xl flex flex-col gap-4"
      >
        <Input label="Job Title" onValueChange={(e) => handleSet("title", e)} />
        <Textarea
          label="Job Description"
          onValueChange={(e) => handleSet("description", e)}
        />
        <Select
          isRequired
          onChange={(e: any) => handleSet("jobLocation", e.target.value)}
          className="max-w-xl"
          label="State"
          placeholder="Select State"
        >
          {indianStates.map((state) => (
            <SelectItem key={state.key}>{state.label}</SelectItem>
          ))}
        </Select>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Min Experience (in years)"
            type="number"
            onValueChange={(e) => handleNestedSet("experienceNeeded", "min", e)}
          />
          <Input
            label="Max Experience (in years)"
            type="number"
            onValueChange={(e) => handleNestedSet("experienceNeeded", "max", e)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Min Salary (in ₹)"
            type="number"
            onValueChange={(e) => handleNestedSet("salary", "min", Number(e))}
          />
          <Input
            label="Max Salary (in ₹)"
            type="number"
            onValueChange={(e) => handleNestedSet("salary", "max", Number(e))}
          />
        </div>
        <Button type="submit" color="primary">
          Submit
        </Button>
      </form>
    </div>
  );
}
