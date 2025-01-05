export const formatNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  
  if (num < 1000000) {
    const thousands = num / 1000;
    return `${thousands.toFixed(thousands < 10 ? 1 : 0)}T`;
  }
  
  const millions = num / 1000000;
  return `${millions.toFixed(millions < 10 ? 1 : 0)}M`;
};