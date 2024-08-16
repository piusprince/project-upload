"use client";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { UploadButton } from "./uploadButton";
import { ProjectCard } from "./project-card";
import { GridIcon, Loader2, RowsIcon } from "lucide-react";
import { SearchBar } from "./search-bar";
import { useState } from "react";
import { ProjectTable } from "./project-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Doc } from "../../../../convex/_generated/dataModel";
import { Label } from "@/components/ui/label";

export const EmptyBoxIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    fill="#000000"
    version="1.1"
    id="Capa_1"
    width="800px"
    height="800px"
    viewBox="0 0 462.035 462.035"
    xmlSpace="preserve"
    className="h-32 w-32 animate-bounce text-gray-500"
  >
    <g>
      <path d="M457.83,158.441c-0.021-0.028-0.033-0.058-0.057-0.087l-50.184-62.48c-0.564-0.701-1.201-1.305-1.879-1.845   c-2.16-2.562-5.355-4.225-8.967-4.225H65.292c-3.615,0-6.804,1.661-8.965,4.225c-0.678,0.54-1.316,1.138-1.885,1.845l-50.178,62.48   c-0.023,0.029-0.034,0.059-0.057,0.087C1.655,160.602,0,163.787,0,167.39v193.07c0,6.5,5.27,11.771,11.77,11.771h438.496   c6.5,0,11.77-5.271,11.77-11.771V167.39C462.037,163.787,460.381,160.602,457.83,158.441z M408.516,134.615l16.873,21.005h-16.873   V134.615z M384.975,113.345v42.274H296.84c-2.514,0-4.955,0.805-6.979,2.293l-58.837,43.299l-58.849-43.305   c-2.023-1.482-4.466-2.287-6.978-2.287H77.061v-42.274H384.975z M53.523,155.62H36.65l16.873-21.005V155.62z M438.498,348.69H23.54   V179.16h137.796l62.711,46.148c4.15,3.046,9.805,3.052,13.954-0.005l62.698-46.144h137.799V348.69L438.498,348.69z" />
    </g>
  </svg>
);

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <EmptyBoxIcon />
      <div className="text-2xl">No projects uploaded yet, upload one now</div>
      <UploadButton />
    </div>
  );
}

export function ProjectBrowser({
  title,
  favoritesOnly,
  deletedOnly,
}: {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const organization = useOrganization();
  const user = useUser();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<Doc<"projects">["type"] | "all">("all");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(
    api.projects.getFavorites,
    orgId ? { orgId } : "skip"
  );

  const projects = useQuery(
    api.projects.getProjects,
    orgId
      ? {
          orgId,
        }
      : "skip"
  );

  const isLoading = projects === undefined;

  //   const modifiedProjects =
  //     projects?.map((project) => ({
  //       ...project,
  //       isFavorited: (favorites ?? []).some(
  //         (favorite) => favorite.projectId === project._id
  //       ),
  //     })) ?? [];

  // const userProfile = useQuery(api.students.getStudentProfile, {
  //   studentId: projects?.[0].studentId,
  // });

  const students = useQuery(api.students.getStudents);

  const filteredProjects = projects?.filter((project) => {
    const queryLower = query.toLowerCase();
    const student = students?.find(
      (student) => student.tokenIdentifier === project.studentId
    );

    return (
      project.description.toLowerCase().includes(queryLower) ||
      student?.name?.toLowerCase().includes(queryLower)
      // student?.referenceId?.toLowerCase().includes(queryLower)
    );
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{title}</h1>

        <SearchBar query={query} setQuery={setQuery} />

        <UploadButton />
      </div>

      <Tabs defaultValue="grid">
        <div className="flex justify-between items-center">
          <TabsList className="mb-2">
            <TabsTrigger value="grid" className="flex gap-2 items-center">
              <GridIcon />
              Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="flex gap-2 items-center">
              <RowsIcon /> Table
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2 items-center">
            <Label htmlFor="type-select">Project Type</Label>
            <Select
              value={type}
              onValueChange={(newType) => {
                setType(newType as any);
              }}
            >
              <SelectTrigger id="type-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="document">Document</SelectItem>
                <SelectItem value="presentation">Presentation</SelectItem>
                <SelectItem value="code">Code</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading your projects...</div>
          </div>
        )}

        <TabsContent value="grid">
          <div className="grid grid-cols-3 gap-4">
            {filteredProjects?.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="table">
          <ProjectTable columns={columns} data={filteredProjects ?? []} />
        </TabsContent>
      </Tabs>

      {filteredProjects?.length === 0 && <Placeholder />}
    </div>
  );
}
