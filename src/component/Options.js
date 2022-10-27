/*global chrome */
import styles from "../styles/Background.module.css"
import React, { useEffect, useState } from 'react';

import List from "./popup/list";
export default function Options() {
    const [url, setUrl] = useState('');
    //const [block, setBlock] = useState('');
    const [urlList, setUrlList] = useState({});
    //const [blocked, setBlocked] = useState(false);
    const extensionID = "jpndajehapjaijkgibpmgbbppedelmca"
    
    useEffect(() => {
        

        

        chrome.runtime.sendMessage({
            action : "getUrl"
        })

        chrome.runtime.onMessage.addListener(async (msg={}, sender) => {
            if(msg.action === "sendUrl") {
                
                setUrlList(msg.obj);
                //if(urlList[url]) {
                //    setBlocked(true);
                //} 
                
            }
        })

       //if(url === extensionID) {
       // setBlocked(true);
       //}

        

        
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