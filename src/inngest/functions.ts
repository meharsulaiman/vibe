import { inngest } from "./client";

import { createAgent, openai } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {
    const codeWriterAgent = createAgent({
      name: "Code writer",
      system:
        "You are an expert TypeScript programmer.  Given a set of asks, you think step-by-step to plan clean, " +
        "idiomatic TypeScript code, with comments and tests as necessary." +
        "Do not respond with anything else other than the following XML tags:" +
        "- If you would like to write code, add all code within the following tags (replace $filename and $contents appropriately):" +
        "  <file name='$filename.ts'>$contents</file>",
      model: openai({
        model: "gpt-4o",
      }),
    });

    const { output } = await codeWriterAgent.run(
      `Write a typescript function that removes unnecessary whitespace`
    );

    return { output, event };
  }
);
