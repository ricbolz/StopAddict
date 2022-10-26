/*global chrome */
import styles from '../../styles/Background.module.css';
import React, { useEffect, useState } from 'react';
import Navbar from '../navbar';
import List from './list';




export default function Popup(){

    const [url, setUrl] = useState('');
    const [block, setBlock] = useState('');
    const [urlList, setUrlList] = useState({});
   
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
                console.log(urlList);
            }
        })

        
    }, [block]);

   

    function getRule(){
        
    }
    function addRule(url) {
        
        
        chrome.runtime.sendMessage({
            action: 'block',
            url : url,     
        })

       

        chrome.runtime.onMessage.addListener(async (msg={}, sender) => {
            if(msg.status) {
                setBlock(url + " " + msg.status);
                
            }
            
            
        })
        
        
        
    }

    function removeRule(url) {
       chrome.runtime.sendMessage({
        action: 'remove',
        url: url
       });

      

       chrome.runtime.onMessage.addListener(async (msg={}, sender) => {
        if(msg.status) {
            setBlock(url + " " + msg.status);
        }
        
       });

       
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
            
            <div className="header">
                <h1>Stop Addict</h1>
            </div>
           
            <div className="body">
                <div style={{margin: 10}}>
                    Are you want to Block this site?
                </div>
                <button className={styles.error}
                    onClick={() => {
                        addRule(url);
                      
                    }}
                >
                    <div style={{color: 'white'}}>Block this site</div>
                </button>
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
                <div id="url">{url}</div>
                <div>{block}</div>
                <div>
                {Object.keys(urlList).map((keyName, i) => (
                    <List id={urlList[keyName]} url={keyName}/>
                ))}
                </div>
            </div>
        </div>
    )
    
}