/*global chrome */
import styles from "../styles/Background.module.css"
import React, { useContext, useEffect, useState } from 'react';

import List from "./list";
import { TextField } from "@mui/material";
import { CurrentLangContext } from "./context/currentLang";
export default function WhiteList() {
    const {dict} = useContext(CurrentLangContext);
    const [url, setUrl] = useState('');
    const [error,setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    //const [block, setBlock] = useState('');
    const [urlList, setUrlList] = useState({});
    const [whiteList, setWhiteList] = useState({})
    
    
    
    useEffect(() => {
        // const queryInfo = {active: true, lastFocusedWindow: true};

        // chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
        //     const url = tabs[0].url;
        //     let splitURL = url.split("/")
        //     console.log(splitURL[2]);
        //     setUrl(splitURL[2]);
        //     if(url2!==url) {
        //         if(url!==extensionID) {
        //             setUrl2(url)
        //         }
                
        //     }
        // });

        

        chrome.runtime.sendMessage({
            action : "getUrl"
        })

        chrome.runtime.sendMessage({
            action : "getWhiteList"
        })

        chrome.runtime.onMessage.addListener( async (msg={}, sender) => {
            if(msg.action === "sendUrl") {
                    console.log("can't add");
                    setUrlList(msg.obj);
                
                
                 
                
            } if(msg.action === "sendWhiteList"){
                setWhiteList(msg.obj);
            }
             else {
                
            }

            // if(msg.action === "addUrl") {
            //     console.log("url added");
            //     setAddedUrl(msg.added);
            // }

            // if(msg.action === "removeUrl") {
            //     console.log("url removed");
            //     setAddedUrl(msg.url);
            // }
        })

      

        

        
    });
    //chrome.runtime.onMessage.addListener(async (msg={}, sender) => {
    //    if(msg.status) {
    //        setBlock(msg.status);
    //    }
        
    //   });
       
    
    
    const handleChange = (event) => {
        if(setError) {
            setError(false);
        }
        setUrl(event.target.value.toLowerCase());
    }

    const validateUrl = (data) => {
        const regex = new RegExp(/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/);
        let isUrl = false
        if(regex.test(data)) {
            console.log(data + 'is added')
            isUrl = true;
        }
        return isUrl;
    }
    
    const handleSubmit = () => {
        setUrl(url.trim());
        setUrl(url.toLowerCase());
        console.log(url);
        setError(true);
        if(validateUrl(url)) {
            if(urlList[url]) {
                setErrorText(dict.WhiteList.url_add_error_block);
            } else {
                if(!whiteList[url]) {
            
                    whiteList[url] = "white";
                    chrome.runtime.sendMessage({
                        action: "addRule",
                        type: "white",
                        url:url
                    })
                    setUrl('');
                    setErrorText( dict.WhiteList.url_add+" :" + url);
                } else {
                    setErrorText(`"${url}" ` + dict.WhiteList.url_added);
                }
            }
        } else {
            
            setErrorText(dict.WhiteList.url_add_error);
        }
        
        
    }
    

  
    return(
        <div style={{padding: 10}}>
            <div>{dict.WhiteList.about}</div>
            <div>
                <TextField
                label={dict.WhiteList.input_placeholder}
                value={url}
                onChange={handleChange}
                onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                        handleSubmit();
                    }
                }}/>
                {error ? <div>{errorText}</div> : ""}
            </div>
                <div >
                {Object.keys(whiteList).map((keyName, i) => (
                    <div>
                        <List id={whiteList[keyName]} url={keyName}/>
                    </div>
                ))}
                </div>
            
        </div>
    )
}