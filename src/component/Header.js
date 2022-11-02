/*global chrome */
import { useEffect, useState } from "react";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { FormControlLabel, FormGroup, Switch } from "@mui/material";

let firstStatus;
chrome.storage.local.get("status", function(result) {
    firstStatus = result.status;
})

export default function Header() {
    const [first, setFirst] = useState(true);
    
    const [on, setOn] = useState(firstStatus);
    const [word,setWord] =useState('');

    
    
    
    
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