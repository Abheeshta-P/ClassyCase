export function splitArray<T>(array: Array<T>, numParts: number) {
  const result: Array<Array<T>> = [];

  for (let i = 0; i < array.length; i++) {
    const index = i % numParts;
    if (!result[index]) {
      result[index] = [];
    }
    result[index].push(array[i]);
  }

  return result;
}

export function getDaysInMonth():number {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  // Months with 31 days
  const thirtyOneDays = [0, 2, 4, 6, 7, 9, 11];

  if (thirtyOneDays.includes(month)) return 31;
  if (month === 1) {
    // February check for leap year
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
  }
  return 30;
}