import type { CalendarDayProps, PeriodData } from "../../../model/types";
type Props = {
    periodData: PeriodData[]
}

import { useRef, useState, useMemo, useEffect} from "react";
import * as calendarUtils from "../../../control/calendar"

export default function Calendar(props: Props) {

    const {periodData} = props;

    const [month, setMonth] = useState<number>(new Date().getMonth());
    const [year, setYear] = useState<number>(new Date().getFullYear());

    const days = useMemo(() => calendarUtils.getDays(month, year),[month, year])

    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

    const monthSelector = useRef<HTMLSelectElement>(null);
    const yearSelector = useRef<HTMLInputElement>(null);
    const [propArray, setPropArray] = useState(() => calendarUtils.getDayProps(days, periodData, null, null));

    useEffect(() =>{
        setPropArray(() => calendarUtils.getDayProps(days, periodData, null, null))
    },[days, periodData])

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
                {propArray.map((dayProps, i) => <CalendarDay {...dayProps} key={i}/>)}
            </div>
        </div>
    </div>
  )
}

function CalendarDay(props: CalendarDayProps){
    const {period, day, isSelected, isSelectedFixed} = props;

    return(
        <div className={`relative border hover:bg-blue-500 hover:text-white min-h-7 md:min-h-12 p-[5%] ${isSelected || isSelectedFixed ? " selected" : ""}`}>
            {day.getUTCDate()}
            {period ? <img className="size-5 absolute top-[0%] right-[0%] md:top-2 md:right-5" src="http://localhost:5000/images/blood_icon.png"/> : null}
        </div>
    )
}