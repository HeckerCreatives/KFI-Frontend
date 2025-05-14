export const formatNumber = (num: number | string): string => {
  const newNum = typeof num === 'number' ? num : Number(num);
  return newNum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
