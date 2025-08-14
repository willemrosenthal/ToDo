export function findLowestMissingId(nums: number[]): number {
  nums.sort((a, b) => a - b);

  let expectedNum = 0;

  for (const num of nums) {
    if (num > expectedNum) {
      return expectedNum;
    }
    if (num === expectedNum) {
      expectedNum += 1;
    }
  }

  return expectedNum;
}

export const waitFor = async (seconds: number = 0.2) => {
  await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
};

export const getTimeDifference = (t1: string, t2: string) => {
  const date1 = new Date(t1);
  const date2 = new Date(t2);

  const diffMs = Math.abs(date2.getTime() - date1.getTime());

  return {
    ms: diffMs,
    seconds: diffMs / 1000,
    minutes: diffMs / (1000 * 60),
    hours: diffMs / (1000 * 60 * 60),
    days: diffMs / (1000 * 60 * 60 * 24),
  };
};
