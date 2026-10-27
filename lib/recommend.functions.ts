import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  need: z.string().trim().min(3).max(500),
  budget: z.number().positive().max(100000).nullable(),
  preferences: z.string().trim().max(300),
});

export const getRecommendations = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => inputSchema.parse(d))
  .handler(async ({ data }) => {
    const { recommendProducts } = await import("@/lib/recommend.server");
    return recommendProducts(data);
  });
