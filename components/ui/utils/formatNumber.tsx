export const formatNumber = (num: number | string): string => {
  const newNum = typeof num === 'number' ? num : Number(num);
  return newNum.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatAmount = (value: number | string): string => {
  if (value === '') return '';
  const isNumber = typeof value === 'number';

  if (isNumber) return value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 });

  if (isNaN(Number(value.replace(',', '').replace('.', '')))) return value;

  return Number(value.replace(/,/g, '')).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const removeAmountComma = (value: number | string): string => {
  if (value === '') return '';
  const num = typeof value === 'string' ? Number(value.replace(/,/g, '')) : Number(value);

  return Number(num).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    useGrouping: false,
  });
};
