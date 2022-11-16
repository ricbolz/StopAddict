/*global chrome */
import styles from "../styles/Background.module.css"
import React, { useEffect, useState } from 'react';

import List from "./list";
import { TextField } from "@mui/material";
export default function UrlList() {
    const [url, setUrl] = useState('');
    const [error,setError] = useState(false);
    const [errorText, setErrorText] = useState('');
    //const [block, setBlock] = useState('');
    const [urlList, setUrlList] = useState({});
 
    
    
    
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

        chrome.runtime.onMessage.addListener( async (msg={}, sender) => {
            if(msg.action === "sendUrl") {
                    console.log("same");
                    setUrlList(msg.obj);
                
                
                 
                
            } else {
                
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
            urlList[url] = "url";
            chrome.runtime.sendMessage({
                action: "block",
                url:url
            })
            setUrl('');
            setErrorText("URL added: " + url);
        } else {
            
            setErrorText("It is Not an URL, Try it With Another URL");
        }
        
        
    }
    

  
    return(
        <div className={styles.page}>
            <div>
                <TextField
                label="URL"
                value={url}
                onChange={handleChange}
                onKeyUp={(event) => {
                    if (event.key === 'Enter') {
                        handleSubmit();
                    }
                }}/>
                {error ? <div>{errorText}</div> : ""}
            </div>
                <div>
                {Object.keys(urlList).map((keyName, i) => (
                    <div>
                        <List id={urlList[keyName]} url={keyName}/>
                    </div>
                ))}
                </div>
            
        </div>
    )
}