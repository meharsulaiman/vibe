import { getUsageStatus } from "@/lib/usage";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const usageRouter = createTRPCRouter({
  status: protectedProcedure.query(async () => {
    try {
      const usage = await getUsageStatus();
      return usage;
    } catch (error) {
      console.error("Error fetching usage status:", error);
      throw new Error("Failed to fetch usage status");
    }
  }),
});
