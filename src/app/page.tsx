"use client";

import { useMutation, useQuery } from "convex/react";
import Image from "next/image";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { useOrganization, useUser } from "@clerk/nextjs";

export default function Home() {
  const { organization, isLoaded } = useOrganization();
  const { user, isLoaded: userIsLoaded } = useUser();

  let orgId: string | undefined = undefined;

  if (isLoaded && userIsLoaded) {
    orgId = organization?.id ?? user?.id;
  }

  const addProject = useMutation(api.projects.createProject);
  const projects = useQuery(
    api.projects.getProjects,
    orgId ? { orgId } : "skip"
  );

  console.log({ id: organization?.id });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {projects &&
        projects?.map((project) => (
          <div
            key={project._id}
            className="flex flex-col items-center justify-center gap-4 p-4"
          >
            <h1 className="text-2xl font-bold">{project.name}</h1>
          </div>
        ))}

      <Button
        onClick={() => {
          console.log({ orgId });
          if (!orgId) return;
          addProject({ name: "test", orgId });
        }}
      >
        Add project
      </Button>
    </main>
  );
}
