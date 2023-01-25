/*global chrome */
import { useContext, useEffect, useState } from "react";

import { FormControlLabel, FormGroup, Switch } from "@mui/material";
import Timer from "./Timer";
import { CurrentLangContext } from "./context/currentLang";
import { LangSwitcher } from "./context/langSwitcher";






export default function Header() {
    const {dict} = useContext(CurrentLangContext);
    const [on, setOn] = useState(true);
    const [word, setWord] = useState("ON");
    const [deadline, setDeadline] = useState(new Date());
    

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
            setWord(dict.Header.status_on);
        } else {
            setWord(dict.Header.status_off);
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
        <div >
            <div className="header" style={{ display: "flex" }}>
            <h1 style={{ flex: 1, color: '#FFF0E9"'}}>Stop Addict</h1>
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
            <LangSwitcher/>
            <Timer deadline={deadline}/>
            
            
        </div>
        
    )
}