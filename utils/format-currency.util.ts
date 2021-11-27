export function formatCurrency(number) {
    return new Intl.NumberFormat('fr', { style: 'currency', currency: 'XAF' })
        .format(number);
}