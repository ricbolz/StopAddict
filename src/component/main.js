/*global chrome */
import styles from '../styles/Background.module.css';
import React, { useContext, useEffect, useState } from 'react';
import Timer from './Timer';
import { CurrentLangContext } from './context/currentLang';
export default function Main(){
    const { userLanguage ,dict} = useContext(CurrentLangContext);
    const [url, setUrl] = useState('');
    // const [block, setBlock] = useState('');
    const [urlList, setUrlList] = useState({});
    const [blocked, setBlocked] = useState(false);
    const extensionID = "jpndajehapjaijkgibpmgbbppedelmca";
    const [blockURL, setBlockURL] = useState('')
    
    useEffect(() => {
        const queryInfo = {active: true, lastFocusedWindow: true};

        chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
            var url;
            if(tabs[0].url) {
                url = tabs[0].url;
                let splitURL = url.split("/");
                let firstUrl = splitURL[2];
                
                let splitURL2 = firstUrl.split(".");
                let finalURL;
                if(splitURL2.length >= 3) {
                    if (splitURL[2].includes("www.")) {
                        finalURL = firstUrl.substring(firstUrl.indexOf('.')+1);
                        
                    } else {
                        finalURL =firstUrl;
                    }
                } else {
                    finalURL = firstUrl;
                }
            
                if(finalURL === extensionID) {
                    console.log("ext ID");
                } else {
                    console.log(finalURL);
                }
                setUrl(finalURL);
            }


           
            
        });

        if(url === extensionID) {
            setBlocked(true);
        }
        chrome.runtime.sendMessage({
            action : "getUrl"
        })

        chrome.runtime.onMessage.addListener( (msg={}, sender) => {
            if(msg.action === "sendUrl") {
                
                setUrlList(msg.obj);
                if(urlList[url]) {
                    setBlocked(true);
                } 
                
            }

            else if(msg.action === "blockedURL") {
                setBlockURL(msg.url);
            } else {

            }
        })

       

        

        
    }, [url]);
    // chrome.runtime.onMessage.addListener( (msg={}, sender) => {
    //     if(msg.status) {
    //         setBlock(msg.status);
    //     } else {

    //     }
        
    //    });
       
    function addRule(url) {
        
        
        chrome.runtime.sendMessage({
            action: 'addRule',
            type: "block",
            url : url,     
        })  
        
        

        // chrome.runtime.onMessage.addListener(async (msg={}, sender) => {
        //     if(msg.status) {
        //         setBlock(msg.status);
        //     } else {

        //     }
            
            
        // })


    //     chrome.tabs.update({
    //         url: "blocked.html?url="+url
    //    });

        chrome.tabs.reload();
        
       chrome.runtime.sendMessage({
        action : "getUrl"
    })

    setBlocked(true);
        
    }

    // function removeRule(url) {
    //    chrome.runtime.sendMessage({
    //     action: 'remove',
    //     url: url
    //    });

    //    chrome.runtime.onMessage.addListener( (msg={}, sender) => {
    //     if(msg.status) {
    //         setBlock(msg.status);
    //         setBlocked(false);
    //     } else {

    //     }
        
    //    });

       

    //    chrome.tabs.update({
    //         url: "https://"+url
    //    });

    //    chrome.runtime.sendMessage({
    //     action : "getUrl"
    // })

       
    // }

    // function clearRule() {
    //     chrome.runtime.sendMessage({
    //         action: 'clear',
    //     })

    //     chrome.runtime.onMessage.addListener(async (msg={}, sender) => {
    //         if(msg.status) {
    //             setBlock(" " + msg.status);
    //         } else {
                
    //         }
            
    //        });

    // }

  
    return(
        <div className={styles.page}>
            
            
           
            <div className="body">
                <div style={{margin: 10}}>
                    {(blocked) ?  dict.Main.page_blocked : (url.split('.').length < 2) ? dict.Main.page_blocked_cant :  ((userLanguage === "en") ? dict.Main.page_block + " " + url  : url + " " + dict.Main.page_block) + "?"}
                </div>
                {(!blocked & (url.split('.').length > 1)) ? 
                <button className={styles.error}
                onClick={() => {
                    addRule(url);
                  
                }}
            >
                <div style={{color: 'white'}}>{dict.Main.block_button_text}</div>
            </button> : ''}
                
               
                
               
            </div>
            
        </div>
    )
    
}