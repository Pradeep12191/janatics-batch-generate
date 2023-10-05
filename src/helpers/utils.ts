export const round = (value, decimal = 100) => {
    return Math.round(value * decimal) / decimal
}