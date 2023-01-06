import { useState, useEffect } from "react"

const SECOND = 1000;
const MINUTE = SECOND*60;
const HOUR = MINUTE*60;
const DAY = HOUR* 24;


export default function useTimer(deadline, interval = SECOND){

    const [time, setTime] = useState(new Date(deadline) - Date.now());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime((_time) => _time - interval);
        },interval);

        return() => {
            clearImmediate(intervalId);
        };
    },[interval]);

    useEffect(() => {
        setTime(new Date(deadline) - Date.now());
    }, [deadline]);

    return {
        days: (time > 0 ? Math.floor(time/DAY) : 0),
        hours: (time > 0 ? Math.floor((time/HOUR) % 24) : 0),
        minutes: (time > 0 ? Math.floor((time/MINUTE) %60) : 0),
        seconds: (time > 0 ? Math.floor((time/SECOND) % 60) : 0)
    };

   
}