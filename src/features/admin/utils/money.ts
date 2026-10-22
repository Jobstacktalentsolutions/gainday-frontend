const currencyFormatter = (currency: "USD" | "GBP") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 });

/**
 * Headline revenue in USD when an exchange rate is configured, otherwise in GBP with a note.
 * `usd` is null exactly when no rate is configured.
 */
export const formatRevenue = (pence: number, usd: number | null) => {
  const gbp = currencyFormatter("GBP").format(pence / 100);
  if (usd === null) {
    return { primary: gbp, secondary: "USD unavailable: no exchange rate configured" };
  }
  return { primary: currencyFormatter("USD").format(usd), secondary: `${gbp} collected` };
};

export const formatAmountForCurrency = (amount: number, currency: "USD" | "GBP") =>
  currencyFormatter(currency).format(amount);
