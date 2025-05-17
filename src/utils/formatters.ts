
export function formatPrice(price: number): string {
  if (price === null || price === undefined) {
    return 'N/A';
  }
  
  // For large numbers, use compact notation
  if (Math.abs(price) >= 1000000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 2
    }).format(price);
  }
  
  // For regular numbers
  const fractionDigits = price < 0.01 ? 6 : price < 1 ? 4 : 2;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits
  }).format(price);
}

export function formatPercentage(percentChange: number): string {
  if (percentChange === null || percentChange === undefined) {
    return 'N/A';
  }
  
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'percent',
    signDisplay: 'always',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(percentChange / 100);
  
  return formattedValue;
}

export function formatNumber(value: number): string {
  if (value === null || value === undefined) {
    return 'N/A';
  }
  
  const formatter = new Intl.NumberFormat('en-US', {
    notation: value >= 1000000 ? 'compact' : 'standard',
    maximumFractionDigits: 2
  });
  
  return formatter.format(value);
}

export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  const start = address.substring(0, chars);
  const end = address.substring(address.length - chars);
  return `${start}...${end}`;
}
