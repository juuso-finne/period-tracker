import { CustomDate } from "../model/types"

export function changeMonth(setMonth: React.Dispatch<React.SetStateAction<number>>, selector: React.RefObject<HTMLSelectElement | null>){
    setMonth(parseInt(selector.current?.value || "0"))
}

export function changeYear(setYear: React.Dispatch<React.SetStateAction<number>>, selector: React.RefObject<HTMLInputElement | null>){
    setYear(parseInt(selector.current?.value || new Date().getFullYear().toString()))
}
export function getDays(month: number, year:number): CustomDate[]{
    const startDate = CustomDate.fromUTC(year, month, 1)

    // This is done to make the week start on Monday
    const offset = (startDate.getDay() + 6) % 7

    const days: CustomDate[] = []
    for (let i = 1; i < 43; i++){
        const newDate = CustomDate.fromUTC(year, month, i - offset)
        if ((newDate.getUTCMonth() > month || newDate.getUTCFullYear() > year) && i % 7 === 1){
            break;
        }
        days.push(newDate)
    }
    return days
}