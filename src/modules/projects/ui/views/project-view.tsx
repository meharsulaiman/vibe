"use client";

// import { useTRPC } from "@/trpc/client";
// import { useSuspenseQuery } from "@tanstack/react-query";
import React, { Suspense, useState } from "react";

import { Fragment } from "@/generated/prisma";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import MessagesContainer from "../components/messages-container";
import ProjectHeader from "../components/project-header";
import FragmentWeb from "../components/fragment-web";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileExplorer } from "@/components/file-explorer";
import UserControl from "@/components/user-control";
import { useAuth } from "@clerk/nextjs";
import { ErrorBoundary } from "react-error-boundary";

interface ProjectViewProps {
  projectId: string;
}

export const ProjectView = ({ projectId }: ProjectViewProps) => {
  const { has } = useAuth();
  const hasProAccess = has?.({
    plan: "pro",
  });
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  // const trpc = useTRPC();
  // const { data: project } = useSuspenseQuery(
  //   trpc.projects.getOne.queryOptions({ id: projectId })
  // );

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <div className="m-4 p-4 rounded-md border border-red-100 bg-red-50 text-red-800">
                <div className="font-medium">Unable to load project header</div>
                <div className="mt-1 text-sm break-words">
                  {error?.message ?? "An unexpected error occurred."}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => resetErrorBoundary()}>
                    Retry
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      navigator.clipboard?.writeText(String(error ?? ""))
                    }
                  >
                    Copy error
                  </Button>
                </div>
              </div>
            )}
          >
            <Suspense
              fallback={
                <div className="p-4">
                  <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-1/3 bg-gray-200 rounded mt-2 animate-pulse" />
                </div>
              }
            >
              <ProjectHeader projectId={projectId} />
            </Suspense>
          </ErrorBoundary>

          <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => (
              <div className="m-4 p-4 rounded-md border border-red-100 bg-red-50 text-red-800">
                <div className="font-medium">Messages failed to load</div>
                <div className="mt-1 text-sm break-words">
                  {error?.message ?? "An unexpected error occurred."}
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => resetErrorBoundary()}>
                    Retry
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      navigator.clipboard?.writeText(String(error ?? ""))
                    }
                  >
                    Copy error
                  </Button>
                </div>
              </div>
            )}
          >
            <Suspense
              fallback={
                <div className="p-4 space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-10 bg-gray-100 rounded-md animate-pulse"
                    />
                  ))}
                </div>
              }
            >
              <MessagesContainer
                projectId={projectId}
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon /> <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon /> <span>Code</span>
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                {!hasProAccess && (
                  <Button asChild size="sm" variant="tertiary">
                    <Link href="/pricing">
                      <CrownIcon /> Upgrade
                    </Link>
                  </Button>
                )}
                <UserControl />
              </div>
            </div>

            <TabsContent value="preview">
              {!!activeFragment && <FragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer
                  files={activeFragment.files as { [path: string]: string }}
                />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
