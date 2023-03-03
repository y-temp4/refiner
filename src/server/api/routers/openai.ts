import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { generateImprovedCode } from '~/server/services/openai'
import { FREE_USAGE_LIMIT } from '~/utils/constant'

export const openaiRouter = createTRPCRouter({
  improve: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input, ctx }) => {
      if (FREE_USAGE_LIMIT <= ctx.session.user.freeUseCount) {
        throw new TRPCError({
          message: 'Free use limit has been reached.',
          code: 'BAD_REQUEST',
        })
      }
      // await new Promise((resolve) => setTimeout(resolve, 500))
      // const { generatedCode, langCode } = {
      //   generatedCode: 'sample code',
      //   langCode: 'typescript',
      // }
      const { generatedCode, langCode } = await generateImprovedCode(input.code)
      if (!generatedCode) {
        throw new TRPCError({
          message: 'No Generated Code.',
          code: 'INTERNAL_SERVER_ERROR',
        })
      }
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: { freeUseCount: ctx.session.user.freeUseCount + 1 },
      })
      return { generatedCode, langCode }
    }),
})
