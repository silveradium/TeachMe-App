export enum UserLevel {
  ONE,
  TWO,
  THREE,
  FOUR,
  FIVE,
}

export const LEVEL_DIVIDERS = {
  [UserLevel.ONE]: 0,
  [UserLevel.TWO]: 1_000,
  [UserLevel.THREE]: 2_500,
  [UserLevel.FOUR]: 5_000,
  [UserLevel.FIVE]: 10_000,
};

export function getLevel(points: number): UserLevel {
  if (points <= LEVEL_DIVIDERS[UserLevel.ONE]) {
    return UserLevel.ONE;
  }

  if (points > LEVEL_DIVIDERS[UserLevel.ONE] && points <= LEVEL_DIVIDERS[UserLevel.TWO]) {
    return UserLevel.TWO;
  }

  if (points > LEVEL_DIVIDERS[UserLevel.TWO] && points <= LEVEL_DIVIDERS[UserLevel.THREE]) {
    return UserLevel.THREE;
  }

  if (points > LEVEL_DIVIDERS[UserLevel.THREE] && points <= LEVEL_DIVIDERS[UserLevel.FOUR]) {
    return UserLevel.FOUR;
  }

  return UserLevel.FIVE;
}

export function getPointsOfNextLevel(points: number, level = getLevel(points)) {
  if (level === UserLevel.FIVE) {
    return 0;
  }

  return LEVEL_DIVIDERS[(level + 1) as UserLevel];
}
