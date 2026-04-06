import type { User } from '~/types/api'

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isUser = (value: unknown): value is User =>
  isRecord(value)
  && typeof value._id === 'string'
  && typeof value.name === 'string'
  && typeof value.email === 'string'

export const extractAuthPayload = (value: unknown) => {
  const root = isRecord(value) ? value : {}
  const data = isRecord(root.data) ? root.data : {}
  const userObj = isRecord(root.user) ? root.user : {}

  const tokenCandidates = [root.token, data.token, userObj.token]
  const userCandidates = [root.user, data.user, data]

  const token = tokenCandidates.find((candidate): candidate is string => typeof candidate === 'string') || ''
  const user = userCandidates.find(isUser) || null

  return { token, user }
}
