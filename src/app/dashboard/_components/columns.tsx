"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Doc, Id } from "../../../../convex/_generated/dataModel";
import { formatRelative } from "date-fns";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProjectCardActions } from "./project-actions";

function StudentCell({ studentId }: { studentId: Id<"students"> }) {
  const studentProfile = useQuery(api.students.getStudentProfile, {
    studentId: studentId,
  });
  return (
    <div className="flex gap-2 text-xs text-gray-700 w-40 items-center">
      <Avatar className="w-6 h-6">
        <AvatarImage src={studentProfile?.image} />
        <AvatarFallback>ST</AvatarFallback>
      </Avatar>
      {studentProfile?.name}
    </div>
  );
}

export const columns: ColumnDef<
  Doc<"projects"> & {
    fileUrl: string;
  }
>[] = [
  {
    accessorKey: "name",
    header: "Project Name",
  },
  {
    accessorKey: "type",
    header: "File Type",
  },
  {
    header: "Student",
    cell: ({ row }) => {
      return <StudentCell studentId={row.original.studentId} />;
    },
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    header: "Submitted On",
    cell: ({ row }) => {
      return (
        <div>
          {formatRelative(new Date(row.original._creationTime), new Date())}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <div>
          <ProjectCardActions
            isHighlighted={row.getIsSelected()}
            project={{ ...row.original, url: null }}
          />
        </div>
      );
    },
  },
];
