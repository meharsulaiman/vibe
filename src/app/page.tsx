"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";

const Page = () => {
  const trpc = useTRPC();

  const { data: messages } = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(trpc.messages.create.mutationOptions({}));
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <Button
        onClick={() =>
          createMessage.mutate({
            value: "Create a landing yellow color page",
          })
        }
      >
        Invoke Background Job
      </Button>
      {JSON.stringify(messages, null, 2)}
    </div>
  );
};

export default Page;
