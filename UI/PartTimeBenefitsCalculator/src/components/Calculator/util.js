import numbro from 'numbro';

export const toCurrency = (val) => {
  if (typeof val === 'string' && val.length === 0) {
    return NaN;
  }
  return numbro(val).formatCurrency({ mantissa: 0 });
};


export const displayCurrency = (val) => {
  const currency = toCurrency(val);
  return`<span class="ma__show-currency">${currency}</span>`;
};

export const toNumber = (val) => {
  if (typeof val === 'string') {
    if (val.length > 0) {
      return numbro.unformat(val);
    }
    if ((val.length === 0) || !val) {
      return NaN;
    }
  }
  return Number(val);
};
