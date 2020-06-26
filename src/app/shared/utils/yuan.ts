/**
 * Converted to RMB meta string
 * @param digits When the number type, it is allowed to specify the number of digits after the decimal point, the default is 2 decimal places
 */
// tslint:disable-next-line:no-any
export function yuan(value: any, digits: number = 2): string {
  if (typeof value === 'number') {
    value = value.toFixed(digits);
  }
  return `&yen ${value}`;
}
