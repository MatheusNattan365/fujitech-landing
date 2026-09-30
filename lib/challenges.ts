export const challengeIds = ["modernizar", "integrar", "automatizar", "infraestrutura"] as const;

export type ChallengeId = (typeof challengeIds)[number];

export function isChallengeId(value: string | undefined): value is ChallengeId {
  return challengeIds.some((item) => item === value);
}
