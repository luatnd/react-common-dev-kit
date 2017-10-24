import * as accounting from 'accounting'


/*
accounting.settings = {
  currency: {
    symbol : "$",   // default currency symbol is '$'
    format: "%s%v", // controls output: %s = symbol, %v = value/number (can be object: see below)
    decimal : ".",  // decimal point separator
    thousand: ",",  // thousands separator
    precision : 2   // decimal places
  },
  number: {
    precision : 0,  // default precision on numbers is 0
    thousand: ",",
    decimal : "."
  }
}
 */

//  TODO: Can be replace by i18n format string ?
export function formatMoneyLocale(value:number, locale = 'vi', options:{precision:number}):string {
  switch (locale) {
    case 'vi':
      const precision = options && options.precision ? options.precision : 0;
      return accounting.formatMoney(value, {symbol: 'đ', format: "%v%s", precision});

    case 'en':
    default:
      return accounting.formatMoney(value);
  }

}
