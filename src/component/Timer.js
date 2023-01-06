import { useState, useEffect, } from "react"
import useTimer from "./timer/useTimer";
import {React} from 'react';



export default function Timer(props){

    //const [time, setTime] = useState(new Date(deadline) - Date.now());
    const {days, hours, minutes,seconds} = useTimer(props.deadline);

    return(
        <div>
            {days} {hours} {minutes} {seconds}
        </div>
    )
   
}