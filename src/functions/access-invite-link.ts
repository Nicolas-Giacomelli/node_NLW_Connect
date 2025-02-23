import { redis } from '../redis/client'

interface AccessInviteLinkParams {
  subscriberID: string
}

export async function accessInviteLink({
  subscriberID,
}: AccessInviteLinkParams) {
  await redis.hincrby('referral:access-count', subscriberID, 1)
}
