export const VAT_RATE = 15; // 15% VAT
export const DELIVERY_PRICE = 50; // 50 CZK delivery fee

export const calculateVAT = (amount: number): number => {
    return (amount * VAT_RATE) / 100;
};

export const calculateTotalWithVATAndDelivery = (amount: number): number => {
    return amount + calculateVAT(amount) + DELIVERY_PRICE;
};
