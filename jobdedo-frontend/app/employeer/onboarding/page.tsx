"use client";
import { Input } from "@heroui/input";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  useDisclosure,
} from "@heroui/react";
import { accountRoutes } from "@/core/api/apiRoutes";
import { useAsyncList } from "@react-stately/data";
import { getData } from "@/core/api/apiHandler";
import CustomModal from "@/components/Modal/CustomModal";
import { useState } from "react";

export default function OnBoarding() {
  const {
    onOpen: onOpenComapny,
    onOpenChange: onOpenChangeCompany,
    isOpen: isOpenCompany,
    onClose: onCloseComapny,
  } = useDisclosure();

  const [company, setCompany] = useState<any>({});

  const handleSet = (key: any, value: any) => {
    setCompany((prev: any) => ({
      ...prev,
      [key]: key === "foundationDate" ? Date(value) : value,
    }));
  };

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

        items.push({
          _id: "other",
          name: "Others",
        });

        return {
          items,
        };
      } catch (err) {
        console.error("Error fetching autocomplete data:", err);
        return { items: [] };
      }
    },
  });

  return (
    <>
      <div className="flex flex-col gap-4 items-center w-full">
        <form
          // onSubmit={(e) => handleSubmit(e, "user")}
          className="flex flex-col gap-4 items-center w-full p-5"
        >
          <div className="flex flex-row items-start gap-2 w-2/3">
            <Input
              type="date"
              // value={
              //   user.dob ? new Date(user.dob).toISOString().split("T")[0] : ""
              // }
              // onValueChange={(e) => handleSet("user", "dob", e)}
              label="Date of Birth"
            />

            <Input
              // value={user.phoneno}
              // onValueChange={(e) => handleSet("user", "phoneno", e)}
              type="tel"
              label="Phone No"
            />
            <Autocomplete
              className="max-w-xl"
              inputValue={list.filterText}
              isLoading={list.isLoading}
              items={list.items ?? []}
              isRequired
              onSelectionChange={(e) => {
                console.log(e);
                if (e === "other") {
                  console.log(true);
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
          </div>
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
        <form className="flex flex-col gap-4 p-4">
          <Input label="Comapny Name" type="text" />
          <Input
            label="Start Date"
            onValueChange={(e) => handleSet("foundationDate", e)}
            type="date"
          />
          <Input label="Description" type="text" />
        </form>
      </CustomModal>
    </>
  );
}
