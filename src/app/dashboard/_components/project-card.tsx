import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelative } from "date-fns";

import { Doc } from "../../../../convex/_generated/dataModel";
import { FileTextIcon, GanttChartIcon, CodeIcon } from "lucide-react";
import { ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Image from "next/image";
import { ProjectCardActions } from "./project-actions"; // Renamed component

export function ProjectCard({
  project,
}: {
  project: Doc<"projects"> & {
    isFavorited?: boolean;
    url: string | null;
    fileUrl: string;
  };
}) {
  const userProfile = useQuery(api.students.getStudentProfile, {
    studentId: project.studentId,
  });

  const originalObject = {
    document: <GanttChartIcon />,
    presentation: <GanttChartIcon />,
    code: <CodeIcon />,
  };

  const mapToExpectedKeys = (input: {
    document: JSX.Element;
    presentation: JSX.Element;
    code: JSX.Element;
  }) => {
    return {
      pdf: input.document,
      doc: input.presentation,
      docx: input.code,
      zip: <GanttChartIcon />, // Assuming you have a default icon for zip
    };
  };

  const convertedObject = mapToExpectedKeys(originalObject) as Record<
    "pdf" | "doc" | "docx" | "zip",
    React.ReactNode
  >;

  console.log({ projectData: project });

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle className="flex gap-2 text-base font-normal">
          <div className="flex justify-center">
            {convertedObject[project.type]}
          </div>{" "}
          {project.name}
        </CardTitle>
        <div className="absolute top-2 right-2">
          <ProjectCardActions
            isHighlighted={project.isFavorited ?? false}
            project={project}
          />
        </div>
      </CardHeader>
      <CardContent className="h-[200px] flex justify-center items-center">
        {project.type === "doc" && project.fileUrl && (
          <Image
            alt={project.name}
            width="200"
            height="100"
            src={project.fileUrl}
          />
        )}

        {project.type === "docx" && <GanttChartIcon className="w-20 h-20" />}
        {project.type === "doc" && <CodeIcon className="w-20 h-20" />}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
          <Avatar className="w-6 h-6">
            <AvatarImage src={userProfile?.image} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          {userProfile?.name}
        </div>
        <div className="text-xs text-gray-700">
          Uploaded on{" "}
          {formatRelative(new Date(project._creationTime), new Date())}
        </div>
      </CardFooter>
    </Card>
  );
}
