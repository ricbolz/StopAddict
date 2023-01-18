import { useState, useEffect, } from "react";
import styles from '../styles/Background.module.css'
import useTimer from "./timer/useTimer";
import {React} from 'react';



export default function Timer(props){

    //const [time, setTime] = useState(new Date(deadline) - Date.now());
    const {days, hours, minutes,seconds} = useTimer(props.deadline);
    if(days > 0 || hours   > 0 || minutes > 0 || seconds > 0) {
        return(
            <div>
                <div 
                className={styles.timerall}
                >
                    <div className={styles.timerblock}>
                        {days} days
                    </div>
                    <div className={styles.timerblock}>
                        {hours} hours
                    </div>
                    <div className={styles.timerblock}>
                        {minutes} minutes
                    </div>
                    <div className={styles.timerblock}>
                        {seconds} seconds
                    </div>
                </div>
                
            </div>
        )
    }
    
   
}