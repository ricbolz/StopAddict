/*global chrome */
var storage = chrome.storage.local;
console.log("extension loaded")
var urlList = {};
const extensionID = "jpndajehapjaijkgibpmgbbppedelmca"
var wordList = {}
let blockNow;
var statusApp; //false means off


function setStatus(status) {
    storage.set({"status": status}, function() {
        if(status) {
            console.log("blocking on");
        } else {
            console.log("blocking off");
        }    
        statusApp = status;
    })
    
}

function getStatus() {
    let statusMessage;
    let statusCode;
    storage.get("status", function(result) {
            console.log("udah ada isi" + result.status);
            statusApp = result.status;
            statusMessage = (statusApp) ? "blocking is on" : "blocking is off";
            statusCode = (statusApp) ? "1" : "0";
            console.log(statusMessage);
            
    })
    
    
}





function getRules(){
    for (let i =0; i < urlList.length; i++) {
        urlList.splice(i,0);
    }
    storage.get(null, function(items) {
        for(var key in items) {
            if(items[key] === "url") {
                urlList[key] = items[key];
            }
            if(items[key] === "word") {
                wordList[key] = items[key];
            }
            
        }    
    })
    
}


function addRules(url) {

    storage.get(url, function(value) {
        if(!value.key) {
            let obj = {}
           
           
            //let ids = (urlList.length > 0) ? urlList[urlList.length-1] : 0
            obj[url] = "url";
            storage.set(obj, function(data) {
                if(chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                    return;
                }
            })
            urlList[url] = "url";
        }
        else {
            console.log("already blocked");
        }
    })  

}

function addWord(word) {
    storage.get(word, function(value) {
        if(!value.key) {
            let obj = {}
           
           
            //let ids = (urlList.length > 0) ? urlList[urlList.length-1] : 0
            obj[word] = "word";
            storage.set(obj, function(data) {
                if(chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                    return;
                }
            })
            wordList[word] = "word";
        }
        else {
            console.log("already blocked");
        }
    })  
}

function removeURL(url) {
    storage.remove(url, function() {
        if(urlList[url]) {
            delete urlList[url];
            console.log("deleted url: " + url);
        }
        if(wordList[url]) {
            delete wordList[url];
            console.log("deleted word: " + url);
        }
        
        
    })
    
}

function clearRule() {
    for(var key in urlList) {
        delete urlList[key]
       
    }

    storage.clear(function() {
        let error = chrome.runtime.lastError;
        if (error) {
            console.error(error);
        }
    })
    
}

function deleteUrlHistory(url) {
    chrome.history.deleteUrl({url : url});
    console.log("delete url : " + url);
}

function redirectPage(tabId, url) {
    
    //chrome.tabs.create({url: "blocked.html?url="+url, active: true});
    chrome.tabs.update(tabId, { url: "blocked.html?url="+url });
    //chrome.tabs.remove(tabId);
    

    
}

function checkURL(urls,tabId) {
    url = urls;
    let splitURL = url.split("/");
    let firstUrl = splitURL[2];
    let splitURL2 = firstUrl.split(".");
    let finalURL;
    if (splitURL2.length >= 3) {
        if (!splitURL[2].includes("www.")) {
            finalURL = firstUrl.substring(firstUrl.indexOf('.') + 1);
            if (!urlList[finalURL]) {
                finalURL = firstUrl;
            }

        } else {
            finalURL = firstUrl.substring(firstUrl.indexOf('.') + 1);
        }
    } else {
        finalURL = firstUrl;
    }
    if (finalURL === extensionID) {
        console.log("ext ID");
    } else {

        if (urlList[finalURL]) {
            deleteUrlHistory(url);
            chrome.runtime.sendMessage({
                action: "blockedURL",
                url: finalURL
            })
            redirectPage(tabId, finalURL);
        }
    }
}

function formatURL(url) {
    let splitURL = url.split("/");
    let firstUrl = splitURL[2];
    

    return firstUrl;
}

function checkWord(text,url,tab) {
    let blockPage = "chrome-extension://jpndajehapjaijkgibpmgbbppedelmca/blocked.html";
    let lowText = text.toLowerCase();
    let formatted = formatURL(url);
    if(!url.startsWith(blockPage)) {
        for (var key in wordList) {
           
            
            if(lowText.includes(key)) {
                
                
                chrome.tabs.update(tab, { url: "blocked.html?word="+key+"&url="+formatted });
                
                
                break;
            } 
        }
    }
    
}

getRules();
getStatus();




chrome.runtime.onMessage.addListener((msg = {}, sender) => {
    getRules();
    
    
    if(msg.action === 'block') {
        if(msg.url) {
            addRules(msg.url);
        }
        if(msg.word) {
            addWord(msg.word);
        }
        
        chrome.runtime.sendMessage({
            status: "is blocked"
        });
        
    }

    if(msg.action === 'remove') {
        removeURL(msg.url);
        chrome.runtime.sendMessage({
            status: msg.url + " remove success"
        });
        
    }

    else if(msg.action === "clear") {
        clearRule();
        chrome.runtime.sendMessage({
            status: msg.url+ " clear success"
        })
        
    }
    else if(msg.action === 'getUrl') {
        
        //console.log(urlList);
        
    } else if(msg.action === 'getWord') {

    }

    else if(msg.action === 'sendStatus') {
        setStatus(msg.status);
        
    }

    else if(msg.action === 'blockWord') {
        deleteUrlHistory(msg.url);
        chrome.tabs.update(msg.tab, { url: "blocked.html" });
        
    }

    else if(msg.action === 'sendInformation') {
        checkWord(msg.text,msg.url,msg.tab);
    }
    else {
        
    }
    
    chrome.runtime.sendMessage({
        action : "sendUrl",
        obj : urlList
    })

    chrome.runtime.sendMessage({
        action : "sendWord",
        obj : wordList
    })

   
    
    
    
})


// chrome.tabs.onActivated.addListener(function (tabId) {
//     //const queryInfo = {active: true, lastFocusedWindow: true};
//     chrome.tabs && chrome.tabs.query({}, tabs => {
//         tabs.forEach(function(tab) {
//         var url;
//         if(tab.url?.startsWith("chrome://")) return undefined;
//         if(tab.url?.startsWith("chrome-extension://")) return undefined;
//         if (statusApp) {
//             if (tab.url) {
//                 let blockPage = "chrome-extension://jpndajehapjaijkgibpmgbbppedelmca/blocked.html";
//                 if(!tab.url.startsWith(blockPage)) {
//                     let blockedWord = false;
//                     chrome.scripting.executeScript({
//                         target: {tabId: tab.id},
//                         func : () => {
//                             chrome.runtime.sendMessage({
//                                 action: 'sendInformation',
//                                 tab: window.tabId,
//                                 url : window.location.href,
//                                 text : document.body.innerText
//                             })
                           
                           
                           
                            
                            
//                         }
            
                    
//                 })
//                 console.log("one time");
//                 checkURL(tab.url, tab.id);
                
                
//             } 
//         }
//         }
//     })
    





//     });

// });
        
chrome.tabs.onUpdated.addListener(function (tabId) {
    //const queryInfo = { active: true, lastFocusedWindow: true };
    chrome.tabs && chrome.tabs.query({}, tabs => {
        tabs.forEach(function(tab) {
        var url;
        if(tab.url?.startsWith("chrome://")) return undefined;
        if(tab.url?.startsWith("chrome-extension://")) return undefined;
        if (statusApp) {
            if (tab.url) {
                let blockPage = "chrome-extension://jpndajehapjaijkgibpmgbbppedelmca/blocked.html"
                if(!tab.url.startsWith(blockPage)) {
                    let blockedWord = false;
                    chrome.scripting.executeScript({
                        target: {tabId: tab.id},
                        func : () => {
                            let blockPage = "chrome-extension://jpndajehapjaijkgibpmgbbppedelmca/blocked.html"
                            chrome.runtime.sendMessage({
                                action: 'sendInformation',
                                tab: window.tabId,
                                url : window.location.href,
                                text : document.body.innerText
                            })

                            
                            
                           
                            
                            
                        }
            
                    
                })
                console.log("reloaded");
                checkURL(tab.url, tab.id);
                
                
            } 
        }
        }
    })
    




    });
})



