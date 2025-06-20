import{ CustomDate, type CalendarDayProps, type PeriodData } from "../model/types"

export function changeMonth(setMonth: React.Dispatch<React.SetStateAction<number>>, selector: React.RefObject<HTMLSelectElement | null>){
    setMonth(parseInt(selector.current?.value || "0"))
}

export function changeYear(setYear: React.Dispatch<React.SetStateAction<number>>, selector: React.RefObject<HTMLInputElement | null>){
    setYear(parseInt(selector.current?.value || new Date().getFullYear().toString()))
}
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

export function getDayProps(days: CustomDate[], data: PeriodData[], pivot: CustomDate|null, hoverTarget: CustomDate|null): CalendarDayProps[]{
    const selection = pivot !== null && hoverTarget !== null
    const props: CalendarDayProps[] = []
    const dataWithEnd = data.map( p => ({...p, end: p.end ? p.end : CustomDate.todayAsUTC()}));
    const eligibleData = dataWithEnd.filter(i => (i.end) >= days[0] && i.start <= days[days.length - 1]);
    const selectionStart = selection ? Math.min(hoverTarget?.valueOf(), pivot?.valueOf()) : 0;
    const selectionEnd = selection ? Math.max(hoverTarget?.valueOf(), pivot?.valueOf()) : 0;

    days.forEach((day) => {
        const period = eligibleData.find(item => day.isBetween(item.start, item.end))


        const newProps: CalendarDayProps = {
            day,
            isSelected: selection && day.valueOf() >= selectionStart && day.valueOf() <= selectionEnd,
            period: period ? period.id : null
        }

        props.push(newProps);
    })
    return props;
}