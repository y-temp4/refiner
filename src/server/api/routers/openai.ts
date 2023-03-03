import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc'
import { generateImprovedCode } from '~/server/services/openai'

export const openaiRouter = createTRPCRouter({
  improve: protectedProcedure
    .input(z.object({ code: z.string() }))
    .mutation(async ({ input }) => {
      const { generatedCode, langCode } = await generateImprovedCode(input.code)
      if (!generatedCode) {
        throw new TRPCError({
          message: 'No Generated Code.',
          code: 'INTERNAL_SERVER_ERROR',
        })
      }
      return { generatedCode, langCode }
    }),
})
