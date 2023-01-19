import { useState, useEffect, useContext, } from "react";
import styles from '../styles/Background.module.css'
import useTimer from "./timer/useTimer";
import {React} from 'react';
import { CurrentLangContext } from "./context/currentLang";



export default function Timer(props){
    const {dict} = useContext(CurrentLangContext);
    //const [time, setTime] = useState(new Date(deadline) - Date.now());
    const {days, hours, minutes,seconds} = useTimer(props.deadline);
    if(days > 0 || hours   > 0 || minutes > 0 || seconds > 0) {
        return(
            <div>
                <div 
                className={styles.timerall}
                >
                    <div className={styles.timerblock}>
                        {days} {dict.Timer.days}
                    </div>
                    <div className={styles.timerblock}>
                        {hours} {dict.Timer.hours}
                    </div>
                    <div className={styles.timerblock}>
                        {minutes} {dict.Timer.minutes}
                    </div>
                    <div className={styles.timerblock}>
                        {seconds} {dict.Timer.seconds}
                    </div>
                </div>
                
            </div>
        )
    }
    
   
}