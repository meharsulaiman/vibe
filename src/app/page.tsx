"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";

const Page = () => {
  const trpc = useTRPC();

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onError: (error) => {
        toast.error(`Error creating project: ${error.message}`);
      },
    })
  );
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Button
        onClick={() =>
          createProject.mutate({
            value: "Create a landing yellow color page",
          })
        }
      >
        Invoke Background Job
      </Button>
    </div>
  );
};

export default Page;
