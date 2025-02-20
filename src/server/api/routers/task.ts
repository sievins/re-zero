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
      const count = await ctx.db.task.count({
        where: { userId: input.userId },
      });

      if (count > 100) {
        throw new Error("You can't have more than 100 tasks. Time to tidy up!");
      }

      return ctx.db.task.create({
        data: {
          description: input.description,
          userId: input.userId,
        },
      });
    }),

  delete: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        taskId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.task.delete({
        where: {
          id: input.taskId,
          userId: input.userId,
        },
      });

      return task;
    }),
});
