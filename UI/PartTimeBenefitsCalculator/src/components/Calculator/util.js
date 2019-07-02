import numbro from 'numbro';

export const toCurrency = (val) => {
  if (typeof val === 'string' && val.length === 0) {
    return NaN;
  }
  return numbro(val).formatCurrency({ mantissa: 2 });
};


export const displayCurrency = (val) => {
  const currency = toCurrency(val);
  return`<span class="ma__show-currency">${currency}</span>`;
};

// toNumber is returning valid number value and rounding it to 2 decimal places (penny)
export const toNumber = (val) => {
  if (typeof val === 'string') {
    if (val.length > 0) {
      const value = numbro.unformat(val);
      return Number(`${Math.round(`${value}e2`)}e-2`);
    }
    if ((val.length === 0) || !val) {
      return NaN;
    }
  }
  return Number(`${Math.round(`${val}e2`)}e-2`);
};
