import { useRef, useState} from "react";
import * as calendarUtils from "../../../control/calendar"

export default function Calendar() {

    const [month, setMonth] = useState<number>(new Date().getMonth())
    const [year, setYear] = useState<number>(new Date().getFullYear())

    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const monthSelector = useRef<HTMLSelectElement>(null);
    const yearSelector = useRef<HTMLInputElement>(null);

  return (
    <div className="w-md">
        <div className="flex">
            <select ref={monthSelector} onChange={() => calendarUtils.changeMonth(setMonth, monthSelector)} defaultValue={month}>
                {months.map((month, i) => (<option value={i} key={month}>{month}</option>))}
            </select>

            <input type="number" min="1900" max={new Date().getFullYear() + 5} ref={yearSelector} defaultValue={year} onChange={() => calendarUtils.changeYear(setYear, yearSelector)}/>
        </div>
            <div className='calendar-grid'>
                {days.map((day, i) => <div className="text-center" key={i}>{day}</div>)}
                {calendarUtils.getDays(month, year).map((day, i) => <div className="text-center" key={i}>{day}</div>)}
            </div>

    </div>
  )
}