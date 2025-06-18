import { CustomDate } from "../model/types"

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