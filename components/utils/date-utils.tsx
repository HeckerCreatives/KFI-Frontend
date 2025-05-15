export const formatDateInput = (date: string): string => {
  const newDate = new Date(date);
  return newDate.toISOString().split('T')[0];
};

export const formatDateTable = (date: string): string => {
  const newDate = new Date(date);
  const month = String(newDate.getMonth() + 1).padStart(2, '0');
  const day = String(newDate.getDate()).padStart(2, '0');
  const year = newDate.getFullYear();
  return `${month}-${day}-${year}`;
};
