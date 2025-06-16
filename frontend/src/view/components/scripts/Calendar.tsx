import { useRef, useState, useEffect } from "react";
import { CustomDate } from "../../../model/types";
import * as calendarUtils from "../../../control/calendar"

export default function Calendar() {

    const [month, setMonth] = useState<number>(new Date().getMonth())
    const [year, setYear] = useState<number>(new Date().getFullYear())

    useEffect(() => {
        console.log(getDays(month, year))
    }, [month, year])

    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const monthSelector = useRef<HTMLSelectElement>(null);
    const yearSelector = useRef<HTMLInputElement>(null);

/*     const changeMonth = () => {
        setMonth(parseInt(monthSelector.current?.value || "0"));
    } */
  return (
    <>
        <div className="flex">
            <select ref={monthSelector} onChange={() => calendarUtils.changeMonth(setMonth, monthSelector)} defaultValue={month}>
                {months.map((month, i) => (<option value={i} key={i}>{month}</option>))}
            </select>

            <input type="number" min="1900" max={new Date().getFullYear() + 5} ref={yearSelector} defaultValue={year} onChange={() => setYear(parseInt(yearSelector.current?.value || new Date().getFullYear().toString()))}/>
        </div>
            <div className='calendar-grid'>
                {days.map((day, i) => <div style={{textAlign:'center'}} key={i}>{day}</div>)}
                {getDays(month, year).map((day, i) => <div key={i}>{day}</div>)}
            </div>

    </>
  )
}

function getDays(month: number, year:number): number[]{
    const startDate = new CustomDate(year, month)

    // This is done to make the week start on Monday
    const offset = (startDate.getDay() + 6) % 7

    const days: number[] = []
    for (let i = 1; i < 43; i++){
        const newDate = CustomDate.fromUTC(year, month, i - offset)
        if ((newDate.getUTCMonth() > month || newDate.getUTCFullYear() > year) && i % 7 === 1){
            break;
        }
        days.push(newDate.getUTCDate())
    }
    return days
}