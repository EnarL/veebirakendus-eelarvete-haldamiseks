export const formatSumma = (summa: string) => {
    const num = parseFloat(summa);
    if (isNaN(num)) return summa;
    return new Intl.NumberFormat("et-EE", { style: "currency", currency: "EUR" }).format(num);
};

export const formatDate = (dateStr: string) => {
    try {
        const date = new Date(dateStr);
        return new Intl.DateTimeFormat("et-EE", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        }).format(date);
    } catch (e) {
        return dateStr;
    }
};