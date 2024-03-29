import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const taskRouter = router({
  getMyTasks: protectedProcedure.query(async ({ ctx }) => {
    const { courses } = await ctx.prisma.user.findUniqueOrThrow({
      where: { id: ctx.session.user.id },
      select: {
        courses: {
          select: {
            courseId: true,
          },
        },
      },
    })
    const courseIds = courses.map((course) => course.courseId)
    return await ctx.prisma.task.findMany({
      where: {
        userId: ctx.session.user.id,
        courseId: {
          in: courseIds,
        },
      },
    })
  }),
  getMyCourseTasks: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.task.findMany({
        where: {
          userId: ctx.session.user.id,
          courseId: input,
        },
      })
    }),
  add: protectedProcedure
    // .input(TaskModel.omit({ id: true, userId: true, createdAt: true }))
    .input(
      z.object({
        title: z.string().nullable(),
        grade: z.number().min(0).max(100),
        segmentId: z.string(),
        courseId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { courseId, segmentId } = input
      await ctx.prisma.usersOnCourses.findUniqueOrThrow({
        where: { userId_courseId: { userId: ctx.session.user.id, courseId } },
      })
      const { segments } = await ctx.prisma.course.findUniqueOrThrow({
        where: { id: courseId },
        select: {
          segments: {
            take: 1,
            where: {
              id: segmentId,
            },
          },
        },
      })
      const segment = segments[0]
      if (!segment)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Segment ${input.title} does not exist on course`,
        })
      const tasks = await ctx.prisma.task.findMany({
        where: {
          userId: ctx.session.user.id,
          courseId,
          segmentId,
        },
      })
      if (tasks.length >= segment.quantity)
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'Number of tasks in segment is at capacity',
        })
      const index = tasks.length
      const newTask = await ctx.prisma.task.create({
        data: {
          ...input,
          userId: ctx.session.user.id,
          index,
        },
      })
      return newTask
    }),
  edit: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().nullable(),
        grade: z.number().min(0).max(100),
        segmentId: z.string(),
        courseId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, courseId, segmentId, grade, title } = input
      await ctx.prisma.usersOnCourses.findUniqueOrThrow({
        where: { userId_courseId: { userId: ctx.session.user.id, courseId } },
      })
      const { segments } = await ctx.prisma.course.findUniqueOrThrow({
        where: { id: courseId },
        select: {
          segments: {
            take: 1,
            where: {
              id: segmentId,
            },
          },
        },
      })
      const segment = segments[0]
      if (!segment)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Segment ${input.title} does not exist on course`,
        })

      const updatedTask = await ctx.prisma.task.update({
        where: { id },
        data: { grade, title },
      })
      return updatedTask
    }),
  reorder: protectedProcedure
    .input(
      z.object({
        courseId: z.string(),
        segmentId: z.string(),
        source: z.number(),
        destination: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { courseId, segmentId, source, destination } = input
      const { courses } = await ctx.prisma.user.findUniqueOrThrow({
        where: { id: ctx.session.user.id },
        select: { courses: { select: { courseId: true } } },
      })
      const courseIds = courses.map((course) => course.courseId)
      if (!courseIds.includes(courseId))
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'You are not in this course.',
        })
      const { segments } = await ctx.prisma.course.findUniqueOrThrow({
        where: { id: input.courseId },
        select: { segments: true },
      })
      const segment = segments.find((s) => s.id === segmentId)
      if (!segment)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Segment does not exist on course`,
        })
      const n = source - destination
      const tasks = await ctx.prisma.task.findMany({
        where: { userId: ctx.session.user.id, courseId, segmentId },
      })
      if (!tasks)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Unable to find one or more tasks to reorder.',
        })

      const sortedTasks = tasks.sort((a, b) => a.index - b.index)
      if (n > 0) {
        for (let i = destination; i < sortedTasks.length; i++) {
          const currentTask = sortedTasks[i]
          if (currentTask) {
            if (currentTask.index === source) break
            await ctx.prisma.task.update({
              where: { id: currentTask.id },
              data: { index: { increment: 1 } },
            })
          }
        }
      } else {
        for (let i = destination; i > 0; i--) {
          const currentTask = sortedTasks[i]
          if (currentTask) {
            if (currentTask.index === source) break
            await ctx.prisma.task.update({
              where: { id: currentTask.id },
              data: { index: { decrement: 1 } },
            })
          }
        }
      }
      await ctx.prisma.task.update({
        where: { id: sortedTasks[source]?.id },
        data: { index: destination },
      })
      return
    }),
})
