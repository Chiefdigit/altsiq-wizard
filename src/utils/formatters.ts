export const formatDollarValue = (value: number) => {
  return `$${value.toLocaleString()}`;
};

export const getSliderColor = (label: string) => {
  switch (label) {
    case "Equities":
      return "#2563eb"; // blue-600
    case "Bonds":
      return "#000000"; // black
    case "Cash":
      return "#22c55e"; // green-500
    case "Alternatives":
      return "#F97316"; // orange-500
    default:
      return "#2563eb"; // blue-600
  }
};