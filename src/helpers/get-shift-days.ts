import { JanShiftModel } from '@oracle-models/jan/jan_shift';
import moment from 'moment'
import momentz from 'moment-timezone'
const timeFormat = 'DD/MM/YYYY hh:mm A';
const timeZone = 'Asia/Kolkata';

let shiftsCache;

/**
 * 
 * @param shifts 
 * @param formattedDate should be in 'DD/MM/YYYY'
 * @returns 
 */
export const getShiftDays = (shifts, formattedDate) => {
    let dayEndCount = 0;
    let dayStartCount = 0;
    const shiftDays = []
    let previousShiftEndDate;
    const currentDateFormatted = formattedDate
    for (let i = 0; i < shifts.length; i++) {
        const shift = shifts[i];
        let isNextDay = false;
        // check in dev - use momentz in dev
        const shiftStartDate = moment(`${currentDateFormatted} ${shift.FROM_TIME}`, timeFormat).add(dayStartCount, 'day');
        const shiftEndDate = moment(`${currentDateFormatted} ${shift.TO_TIME}`, timeFormat).add(dayEndCount, 'day');
        // .add(1, 'minute');

        // if there is a cross in shift to next day, increment the day count, and continue the same shift loop again
        if (previousShiftEndDate && shiftStartDate.isBefore(previousShiftEndDate)) {
            isNextDay = true;
            dayStartCount++;
            i--;
            continue;
        } else if (shiftEndDate.isBefore(shiftStartDate)) {
            isNextDay = true;
            dayEndCount++;
            i--;
            continue;
        }

        previousShiftEndDate = shiftEndDate.clone();

        const startDateTimestamp = shiftStartDate.valueOf();
        const endDateTimestamp = shiftEndDate.valueOf();

        const shiftStartBefore2Hrs = startDateTimestamp - 120 * 60000;
        const shiftStartBefore2HrsInMin = Math.trunc(shiftStartBefore2Hrs / (60 * 1000))
        const startDateinMin = Math.trunc(startDateTimestamp / (60 * 1000))
        const endDateinMin = Math.trunc(endDateTimestamp / (60 * 1000))
        const truncStartDateTimestamp = startDateinMin * 60000
        const truncEndDateTimestamp = endDateinMin * 60000;
        const durationInMin = (endDateTimestamp - startDateTimestamp) / (60 * 1000)


        shiftDays.push({
            shiftStartBefore2Hrs,
            shiftStartBefore2HrsInMin,
            start: shiftStartDate,
            end: shiftEndDate,
            startDateTimestamp,
            endDateTimestamp,
            truncStartDateTimestamp,
            truncEndDateTimestamp,
            startDateObj: shiftStartDate.toDate(),
            endDateObj: shiftEndDate.toDate(),
            startDateinMin,
            endDateinMin,
            info: shift,
            no: i + 1,
            isNextDay,
            durationInMin
        })
    }
    return shiftDays;
}

export const getActiveShift = async (date) => {

    let currentShift = null;
    let searchCount = 0;
    let shiftDate = null;
    let shifts = []
    if (!shiftsCache) {
        shifts = await JanShiftModel.findAll({ raw: true });
        shiftsCache = shifts;
    } else {
        shifts = shiftsCache
    }

    // max loop - 3 times
    while (!currentShift && searchCount < 3) {
        shiftDate = moment(date).subtract(searchCount, 'days')
        const shiftDays = getShiftDays(shifts, shiftDate.format('DD/MM/YYYY'));
        // shiftDays.forEach(sht => {
        //     console.log(sht.start.format(), sht.end.format())
        // })
        for (let i = 0; i < shiftDays.length; i++) {
            const shiftDay = shiftDays[i];

            if (new Date(date) >= shiftDay.start && new Date(date) <= shiftDay.end) {
                currentShift = shiftDay
                break;
            }
        }
        searchCount++;
    }
    return { currentShift, shiftDate }

}