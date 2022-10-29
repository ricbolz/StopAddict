/*global chrome */
import styles from "../styles/Background.module.css"
import React, { useEffect, useState } from 'react';

import List from "./popup/list";
export default function Options() {
    const [url, setUrl] = useState('');
    const [url2, setUrl2] = useState('');
    //const [block, setBlock] = useState('');
    const [urlList, setUrlList] = useState({});
    const [blocked, setBlocked] = useState(false);
    const [addedUrl, setAddedUrl] = useState('');
    const extensionID = "jpndajehapjaijkgibpmgbbppedelmca"
    
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

        chrome.runtime.onMessage.addListener( (msg={}, sender) => {
            if(msg.action === "sendUrl") {
                    console.log("same");
                    setUrlList(msg.obj);
                
                
                 
                
            }

            if(msg.action === "addUrl") {
                console.log("url added");
                setAddedUrl(msg.added);
            }

            if(msg.action === "removeUrl") {
                console.log("url removed");
                setAddedUrl(msg.url);
            }
        })

      

        

        
    });
    //chrome.runtime.onMessage.addListener(async (msg={}, sender) => {
    //    if(msg.status) {
    //        setBlock(msg.status);
    //    }
        
    //   });
       
    
    
    
   
    

  
    return(
        <div className={styles.page}>
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