export const toINRAmount = (amount) => {
  const numericAmount = Number(amount);
  if (Number.isFinite(numericAmount)) return numericAmount;
  return Number(String(amount || "").replace(/[^0-9.-]/g, "")) || 0;
};

export const formatINR = (amount) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(toINRAmount(amount));
