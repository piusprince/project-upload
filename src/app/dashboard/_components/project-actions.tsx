import { Doc, Id } from "../../../../convex/_generated/dataModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileIcon,
  MoreVertical,
  StarHalf,
  StarIcon,
  TrashIcon,
  UndoIcon,
  EditIcon,
  DownloadIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useToast } from "@/components/ui/use-toast";
import { Protect } from "@clerk/nextjs";

export function ProjectCardActions({
  project,
  isHighlighted,
}: {
  project: Doc<"projects">;
  isHighlighted: boolean;
}) {
  const deleteProject = useMutation(api.projects.deleteProject);
  //   const restoreProject = useMutation(api.projects.restoreProject);
  //   const toggleHighlight = useMutation(api.projects.toggleHighlight);
  const { toast } = useToast();
  const me = useQuery(api.students.getMe);

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the project for our deletion process.
              Projects are deleted periodically
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                await deleteProject({
                  projectId: project._id,
                });
                toast({
                  variant: "default",
                  title: "Project marked for deletion",
                  description: "Your project will be deleted soon",
                });
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              if (!project.url) return;
              window.open(project.fileUrl, "_blank");
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <DownloadIcon className="w-4 h-4" /> Download Project
          </DropdownMenuItem>

          <DropdownMenuItem
            // onClick={() => {
            //   toggleHighlight({
            //     projectId: project._id,
            //   });
            // }}
            className="flex gap-1 items-center cursor-pointer"
          >
            {isHighlighted ? (
              <div className="flex gap-1 items-center">
                <StarIcon className="w-4 h-4" /> Remove Highlight
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <StarHalf className="w-4 h-4" /> Highlight Project
              </div>
            )}
          </DropdownMenuItem>

          <DropdownMenuItem className="flex gap-1 items-center cursor-pointer">
            <EditIcon className="w-4 h-4" /> Edit Project Details
          </DropdownMenuItem>

          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || project.studentId === me?._id
              );
            }}
            fallback={<></>}
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                if (project.shouldDelete) {
                  //   restoreProject({
                  //     projectId: project._id,
                  //   });
                } else {
                  setIsConfirmOpen(true);
                }
              }}
              className="flex gap-1 items-center cursor-pointer"
            >
              {project.shouldDelete ? (
                <div className="flex gap-1 text-green-600 items-center cursor-pointer">
                  <UndoIcon className="w-4 h-4" /> Restore Project
                </div>
              ) : (
                <div className="flex gap-1 text-red-600 items-center cursor-pointer">
                  <TrashIcon className="w-4 h-4" /> Delete Project
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
