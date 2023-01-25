/*global chrome */
import {useEffect, useState, useContext} from 'react';
import { CurrentLangContext } from '../context/currentLang';
import Timer from '../Timer';
import "./timer.css";



export default function InputTime() {
    const {dict} = useContext(CurrentLangContext)
    const [hour,setHour] = useState("0");
    const [minute, setMinute] = useState("0");
    const [seconds, setSecond] = useState("0");
    const [deadline, setDeadli] = useState(new Date().toLocaleString());
    const [isPassed, setPassed] = useState(true);
    const [error, setError] = useState('');

    function setDeadline(){
        if(hour > "0" || minute > "0" || seconds > "0") {
            setError('');
            const newHour = hour*3600*1000;
            const newMinute = minute*60*1000;
            const newSecond = seconds*1000;
            const nowDate = new Date(newHour + newMinute + newSecond + Date.now() + 1000)
            setDeadli(nowDate.toLocaleString());
            chrome.runtime.sendMessage({
                action: "startFocusTimer",
                deadline : nowDate.toLocaleString()
            })
            setPassed(false);
            setTimeout(() => {
                setPassed(true);
            }, nowDate - new Date() - 1000);
            
        } else {
            setError(dict.InputTime.set_time_error);
        }
        
    }

    function resetDeadline() {
        const now = new Date(0).toLocaleString();
        chrome.runtime.sendMessage({
            action: "startFocusTimer",
            deadline : now
        })
        setPassed(true);
    }


    useEffect(() => {
        chrome.storage.local.get("dl", function(result) {
            //setDeadli(result.dl);
            const now = new Date();
            const nowDeadline = new Date(result.dl);
            if(now < nowDeadline) {
                setPassed(false);
                setTimeout(() => {
                    setPassed(true);
                }, nowDeadline - now - 1000);
            }
            
         })
    },[deadline])

    return(
        <div>
            
            {isPassed ? 
                <div>
                        <div>
                    <input type="number" id="hour" min={0} max={999} 
                        onChange={(e) => setHour(e.target.value)} value={hour} placeholder={0}/>
                    {dict.InputTime.hours}
                    <input 
                    type="number" 
                    id="minutes" 
                    max={60} 
                    min={0} 
                    placeholder={0}
                        onChange={(e) => {
                            if(e.target.value > 59) {
                                setMinute("59");
                            } else {
                                setMinute(e.target.value);
                            }
                        
                        }}
                    value={minute}
                    />
                    {dict.InputTime.minutes}
                    <input type="number" id="seconds" max={60} min={0} placeholder={0}
                    onChange={(e) => {
                        if(e.target.value > 59) {
                            setSecond("59");
                        } else {
                            setSecond(e.target.value);
                        }
                    
                    }}value={seconds}/>
                    {dict.InputTime.seconds}
                </div>
                <button
                onClick={setDeadline} >
                    {dict.InputTime.focus_button_text}
                </button>
                <div>{error}</div>
                </div>
                
                :
                <div>
                    <div>
                        {dict.InputTime.focus_mode_text}
                        </div>
                    <button
                    onClick={resetDeadline}>
                        {dict.InputTime.reset_button_text}
                    </button>
            
                </div>
                }
           
            
            
            
        </div>
        
    )
}