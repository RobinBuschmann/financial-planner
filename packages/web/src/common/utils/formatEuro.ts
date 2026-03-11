export const formatEuro = (amount: number) => {
  const num = Number(amount);
  const formatted = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(Math.abs(num));
  return num >= 0 ? `+${formatted}` : `−${formatted}`;
};
