/*global chrome */
import { useContext, useEffect, useState } from "react";

import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import Timer from "./Timer";
import { LangContext } from "./context/langProvider";






export default function Header() {

    const [on, setOn] = useState(true);
    const [word, setWord] = useState('');
    const [deadline, setDeadline] = useState(new Date());
    const {dictionary} = useContext(LangContext);

    chrome.storage.local.get("st", function(result) {
        console.log(result);
        setOn(result.st);
    })
    
    chrome.storage.local.get("dl", function(result) {
        setDeadline(new Date(result.dl));
        console.log(result);
    })


    useEffect(() => {

        // chrome.storage.local.get("st", function(result) {
        //     console.log(result);
        //     setOn(result.status);
        // })

        if (on) {
            setWord(dictionary.Header.status_on);
        } else {
            setWord(dictionary.Header.status_off);
        }


    }, [on])


    function changeStatus() {

        chrome.runtime.sendMessage({
            action: "sendStatus",
            status: !on

        })
        setOn(!on);
        
    }



    return (
        <div>
            <div className="header" style={{ display: "flex", padding: 10 }}>
            <h1 style={{ flex: 1 }}>Stop Addict</h1>
            <div style={{ flex: 1 }}>
                <FormGroup>
                    <FormControlLabel control={
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
            <Timer deadline={deadline}/>
            
            
        </div>
        
    )
}