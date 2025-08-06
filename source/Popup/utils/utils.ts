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
