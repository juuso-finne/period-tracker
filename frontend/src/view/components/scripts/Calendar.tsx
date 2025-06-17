import type { CalendarDayProps } from "../../../model/types";

import { useRef, useState, useEffect} from "react";
import * as calendarUtils from "../../../control/calendar"
import { CustomDate } from "../../../model/types";

export default function Calendar() {

    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [days, setDays] = useState<CustomDate[]>([]);

    useEffect(() =>{
        setDays(calendarUtils.getDays(month, year))
    },[month, year])

    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const monthSelector = useRef<HTMLSelectElement>(null);
    const yearSelector = useRef<HTMLInputElement>(null);
    const props = {
        period: null,
        day: new CustomDate(),
        isSelected: false,
        isSelectedFixed: false
    }

  return (
    <div className="flex flex-col items-center mx-2 md:mx-0">
        <div className=" w-full md:w-3/4 ">
            <div className="flex justify-center">
                <select className="border" ref={monthSelector} onChange={() => calendarUtils.changeMonth(setMonth, monthSelector)} defaultValue={month}>
                    {months.map((month, i) => (<option value={i} key={month}>{month}</option>))}
                </select>
                <input className="border p-1" type="number" min="1900" max={new Date().getFullYear() + 5} ref={yearSelector} defaultValue={year} onChange={() => calendarUtils.changeYear(setYear, yearSelector)}/>
            </div>

            <div className='grid grid-cols-7 border'>
                {weekDays.map((day, i) => <div className="text-center" key={i}>{day}</div>)}
                {days.map((day, i) => <CalendarDay {...props} day={day} key={i}/>)}
            </div>
        </div>
    </div>
  )
}

function CalendarDay(props: CalendarDayProps){
    const {period, day, isSelected, isSelectedFixed} = props;

    return(
        <div className={`relative border hover:selected min-h-7 md:min-h-12 p-[5%] ${isSelected ? " selected" : ""}`}>
            {day.getUTCDate()}
            {period ? <img className="size-5 absolute top-[0%] right-[0%]" src="http://localhost:5000/images/blood_icon.png"/> : null}
        </div>
    )
}