import { Card, CardBody, CardFooter, CardHeader, Chip } from "@heroui/react";

export default function CompanyCard({
  companyInfo,
  count,
}: {
  companyInfo: any;
  count: number;
}) {
  return (
    <Card className="w-full">
      <CardHeader>
        <h1 className="text-xl font-semibold">{companyInfo.name}</h1>
      </CardHeader>
      <CardBody className="flex flex-col gap-4 p-4">
        <Chip className="p-4 rounded-full bg-primary-500 text-white">
          {companyInfo.level} Employees
        </Chip>
        <p>{companyInfo.description}</p>
        <p>
          ESTD{" "}
          {companyInfo.foundationDate
            ? new Date(companyInfo.foundationDate).toDateString()
            : "N/A"}
        </p>
        <p>No of Employees on the platform {companyInfo.users.length}</p>
        <h1>Vacancies: {companyInfo.jobs.length}</h1>
      </CardBody>
    </Card>
  );
}
