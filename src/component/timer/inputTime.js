/*global chrome */
import {useEffect, useState} from 'react';
import Timer from '../Timer';


export default function InputTime() {
    const [hour,setHour] = useState("0");
    const [minute, setMinute] = useState("0");
    const [seconds, setSecond] = useState("0");
    const [deadline, setDeadli] = useState(new Date().toLocaleString());

    function setDeadline(){
        const newHour = hour*3600*1000;
        const newMinute = minute*60*1000;
        const newSecond = seconds*1000;
        const nowDate = new Date(newHour + newMinute + newSecond + Date.now() + 1000)
        setDeadli(nowDate.toLocaleString());
        chrome.runtime.sendMessage({
            action: "startFocusTimer",
            deadline : nowDate.toLocaleString()
        })
    }


    useEffect(() => {
        chrome.storage.local.get("dl", function(result) {
            //setDeadli(result.dl);
            
         })
    },[deadline])

    return(
        <div>
            <div>
                <input type="number" id="hour" min={0} max={999} 
                    onChange={(e) => setHour(e.target.value)} value={hour}/>
                <input 
                type="number" 
                id="minutes" 
                max={60} 
                min={0} 
                    onChange={(e) => {
                        if(e.target.value > 59) {
                            setMinute("59");
                        } else {
                            setMinute(e.target.value);
                        }
                    
                    }}
                value={minute}
                />
                <input type="number" id="seconds" max={60} min={0} 
                onChange={(e) => {
                    if(e.target.value > 59) {
                        setSecond("59");
                    } else {
                        setSecond(e.target.value);
                    }
                
                }}value={seconds}/>
            </div>
            <button
            onClick={setDeadline}>
                set deadline
            </button>
            <Timer deadline={deadline}/>
            
            
        </div>
        
    )
}