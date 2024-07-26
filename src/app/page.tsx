"use client";

import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";

export default function Home() {
  const addProject = useMutation(api.projects.createProject);
  const projects = useQuery(api.projects.getProjects);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {projects &&
        projects.length > 0 &&
        projects.map((project) => (
          <div
            key={project._id}
            className="flex flex-col items-center justify-center gap-4 p-4"
          >
            <h1 className="text-2xl font-bold">{project.name}</h1>
          </div>
        ))}

      <Button onClick={() => addProject({ name: "test" })}>Add project</Button>
    </main>
  );
}
