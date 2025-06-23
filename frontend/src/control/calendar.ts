import{ CustomDate, type CalendarDayProps, type PeriodData } from "../model/types"

export function getDays(month: number, year:number): CustomDate[]{
    const startDate = CustomDate.UTCFromValues(year, month, 1)

    // This is done to make the week start on Monday
    const offset = (startDate.getDay() + 6) % 7

    const days: CustomDate[] = []

    // 6 weeks, i.e. 42 days is enough to fully show any calendar month
    for (let i = 1; i < 43; i++){
        const newDate = CustomDate.UTCFromValues(year, month, i - offset)

        // Don't add a new week if it's entirely in the next month
        if (newDate.getUTCMonth() === (month + 1) % 12 && i % 7 === 1){
            break;
        }
        days.push(newDate)
    }
    return days
}

export function getDayProps(days: CustomDate[], data: PeriodData[], selectionStart: CustomDate|null, selectionEnd: CustomDate|null): CalendarDayProps[]{
    const props: CalendarDayProps[] = []
    const dataWithEnd = data.map( p => ({...p, end: p.end ? p.end : CustomDate.todayAsUTC()}));
    const eligibleData = dataWithEnd.filter(i => (i.end) >= days[0] && i.start <= days[days.length - 1]);

    days.forEach((day) => {
        const period = eligibleData.find(item => day.isBetween(item.start, item.end))


        const newProps: CalendarDayProps = {
            day,
            isSelected: selectionStart && selectionEnd ? day >= selectionStart && day <= selectionEnd : false,
            period: period ? period.id : null
        }

        props.push(newProps);
    })
    return props;
}