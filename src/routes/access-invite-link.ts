import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { env } from '../env'
import { accessInviteLink } from '../functions/access-invite-link'
import { redis } from '../redis/client'

export const accessInviteLinkRoute: FastifyPluginAsyncZod = async app => {
  app.get(
    '/invites/:subscriberID',
    {
      schema: {
        summary: 'Access invite link and redirects user',
        tags: ['referral'],
        description: 'Subscribe to an event',
        params: z.object({
          subscriberID: z.string(),
        }),
        response: {
          201: z.object({
            subscriberID: z.string(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { subscriberID } = request.params

      await accessInviteLink({ subscriberID })

      console.log(await redis.hgetall('referral:access-count'))

      console.log(subscriberID)

      const redirectURL = new URL(env.WEB_URL)

      redirectURL.searchParams.set('referrer', subscriberID)

      return reply.redirect(redirectURL.toString(), 302)
    }
  )
}
