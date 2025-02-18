import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const taskRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(z.object({ userId: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      if (!input.userId) {
        return [];
      }

      const tasks = await ctx.db.task.findMany({
        where: { userId: input.userId },
        orderBy: [{ createdAt: "desc" }],
      });

      return tasks;
    }),

  create: publicProcedure
    .input(
      z.object({ description: z.string().min(1).max(280), userId: z.string() }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.task.create({
        data: {
          description: input.description,
          userId: input.userId,
        },
      });
    }),
});
