export const formatMoney = (value: string | number) => {
  if (value === null || value === undefined || value === '') {
    return '0.00';
  }

  const stringValue = typeof value === 'string' ? value : String(value);
  const cleanedValue = stringValue.replace(/[^\d.-]/g, '');
  const numberValue = parseFloat(cleanedValue);

  if (isNaN(numberValue)) {
    return '0.00';
  }

  const roundedValue = Math.round(numberValue * 100) / 100;

  return roundedValue.toLocaleString('en-US', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  });
};
