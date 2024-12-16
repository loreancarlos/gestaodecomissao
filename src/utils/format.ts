export function formatCurrency(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "R$ 0,00";
  }

  try {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    console.error("Error formatting currency value:", error);
    return "R$ 0,00";
  }
}

export function formatPercentage(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0%";
  }

  try {
    return value.toLocaleString("pt-BR", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    console.error("Error formatting percentage value:", error);
    return "0%";
  }
}

export function formatInterestRate(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0,00%";
  }

  try {
    return `${value.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}% a.a.`;
  } catch (error) {
    console.error("Error formatting interest rate value:", error);
    return "0,00%";
  }
}

export function formatNumber(value: number | null | undefined): string {
  if (value === null || value === undefined || isNaN(value)) {
    return "0";
  }

  try {
    return value.toLocaleString("pt-BR", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  } catch (error) {
    console.error("Error formatting number value:", error);
    return "0";
  }
}

export function formatDate(value: string | null | undefined): string {
  if (!value) return "";

  try {
    // If the value is already in YYYY-MM-DD format, return it as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return value;
    }

    // Convert from API format (if needed) and return YYYY-MM-DD
    const date = new Date(value);
    date.setHours(date.getHours() + 3);
    return date.toISOString().split("T")[0];
  } catch (error) {
    console.error("Error formatting date value:", error);
    return "";
  }
}

export function formatDateDisplay(value: string | null | undefined): string {
  if (!value) return "";

  try {
    const date = new Date(value);
    date.setHours(date.getHours() + 3);
    return date.toLocaleDateString("pt-BR");
  } catch (error) {
    console.error("Error formatting date for display:", error);
    return "";
  }
}

export function formatDateTime(
  value: string | Date | null | undefined
): string {
  if (!value) return "";

  try {
    const date = value instanceof Date ? value : new Date(value);
    date.setHours(date.getHours() + 3);
    return date.toLocaleString("pt-BR");
  } catch (error) {
    console.error("Error formatting datetime value:", error);
    return "";
  }
}
// Add new name formatter
export function formatDisplayName(name: string | undefined | null): string {
  if (!name) return "";

  const words = name.trim().split(" ");
  return words.slice(0, 2).join(" ");
}
