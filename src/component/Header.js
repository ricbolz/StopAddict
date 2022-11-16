/*global chrome */
import { useEffect, useState } from "react";

import { FormControlLabel, FormGroup, Switch } from "@mui/material";




export default function Header() {
    
    const [on, setOn] = useState(true);
    const [word,setWord] =useState('');

    
    chrome.storage.local.get("status", function(result) {
        setOn(result.status);
    })
    
    
    useEffect(() => {
        
        
        if(on) {
            setWord("ON");
        } else {
            setWord("OFF");
        }

        
    },[on])


    function changeStatus() {
        
        chrome.runtime.sendMessage({
            action : "sendStatus",
            status: !on

        })
        setOn(!on);
    }
    

    
    return(
        <div className="header" style={{display: "flex", padding: 10}}>
                <h1 style={{flex: 1}}>Stop Addict</h1>
                <div style={{flex: 1}}>
                    <FormGroup>
                        <FormControlLabel control = {
                            <Switch 
                            checked={on}
                            onChange={changeStatus}
    
                        />
                        }
                        label={word}
                        />
                    </FormGroup>
                    
                </div>
                
        </div>
    )
}