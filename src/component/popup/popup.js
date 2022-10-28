/*global chrome */
import styles from '../../styles/Background.module.css';
import React, { useEffect, useState } from 'react';
import Navbar from '../navbar';
import List from './list';




export default function Popup(){

    const [url, setUrl] = useState('');
    const [block, setBlock] = useState('');
    const [urlList, setUrlList] = useState({});
    const [blocked, setBlocked] = useState(false);
    const extensionID = "jpndajehapjaijkgibpmgbbppedelmca"
    
    useEffect(() => {
        const queryInfo = {active: true, lastFocusedWindow: true};

        chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
            const url = tabs[0].url;
            let splitURL = url.split("/")
            console.log(splitURL[2]);
            setUrl(splitURL[2]);
        });
        chrome.runtime.sendMessage({
            action : "getUrl"
        })

        chrome.runtime.onMessage.addListener(async (msg={}, sender) => {
            if(msg.action === "sendUrl") {
                
                setUrlList(msg.obj);
                if(urlList[url]) {
                    setBlocked(true);
                } 
                
            }
        })

       if(url === extensionID) {
        setBlocked(true);
       }

        

        
    }, [block]);
    chrome.runtime.onMessage.addListener(async (msg={}, sender) => {
        if(msg.status) {
            setBlock(msg.status);
        }
        
       });
       
    
    
    
    function getRule(){
        
    }
    function addRule(url) {
        
        
        chrome.runtime.sendMessage({
            action: 'block',
            url : url,     
        })  
        
        chrome.runtime.sendMessage({
            action: "addUrl",
            added : url
        })

        chrome.runtime.onMessage.addListener(async (msg={}, sender) => {
            if(msg.status) {
                setBlock(msg.status);
            }
            
            
        })


        chrome.tabs.update({
            url: "blocked.html"
       });
        
       chrome.runtime.sendMessage({
        action : "getUrl"
    })

    setBlocked(true);
        
    }

    function removeRule(url) {
       chrome.runtime.sendMessage({
        action: 'remove',
        url: url
       });

       chrome.runtime.onMessage.addListener( (msg={}, sender) => {
        if(msg.status) {
            setBlock(msg.status);
            setBlocked(false);
        }
        
       });

       

       chrome.tabs.update({
            url: "https://"+url
       });

       chrome.runtime.sendMessage({
        action : "getUrl"
    })

       
    }

    function clearRule() {
        chrome.runtime.sendMessage({
            action: 'clear',
        })

        chrome.runtime.onMessage.addListener(async (msg={}, sender) => {
            if(msg.status) {
                setBlock(" " + msg.status);
            }
            
           });

    }

  
    return(
        <div className={styles.page}>
            
            
           
            <div className="body">
                <div style={{margin: 10}}>
                    {(blocked) ? "This site is blocked" : "Are you want to block " + url + "?"}
                </div>
                {(!blocked) ? 
                <button className={styles.error}
                onClick={() => {
                    addRule(url);
                  
                }}
            >
                <div style={{color: 'white'}}>Block this site</div>
            </button> : ''}
                
                <button
                    onClick={() => {
                        removeRule(url);
                    }}
                    >
                    Open optios Page
                </button>
                <button
                onClick={() => {
                    clearRule();
                }}>Clear all url</button>
                <div>{block}</div>
               
            </div>
        </div>
    )
    
}