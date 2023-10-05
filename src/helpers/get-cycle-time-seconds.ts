

export const getCycleTimeSecs = (CycleTime) => {
    const qtyPerHr = Math.floor(1 / CycleTime)
    const qtyPerMin = qtyPerHr / 60;
    const qtyPerSecs = qtyPerMin / 60;
    const secsPerQty = 1 / qtyPerSecs
    return  Math.round(secsPerQty)
}