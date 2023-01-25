/*global chrome */
var storage = chrome.storage.local;
console.log("extension loaded")
var urlList = {};
const extensionID = "jpndajehapjaijkgibpmgbbppedelmca"
var wordList = {};
var whiteList = {};
let blockNow;
var focusStatus = false;
var deadline;
var language;
var statusApp; //false means off
let blockPage = "chrome-extension://jpndajehapjaijkgibpmgbbppedelmca/blocked.html";
var goToBlockPage = "blocked.html?"
const tabUrl = new Map();
var startDeadline;
function setStatus(status) {
    storage.set({"st": status}, function() {
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
    storage.get("st", function(result) {
            statusApp = result.st;
            statusMessage = (statusApp) ? "blocking is on" : "blocking is off";
            statusCode = (statusApp) ? "1" : "0";
            console.log(statusMessage);
            
    })

    storage.get("dl", function(result){
        let diff = new Date(result.dl) - new Date();
        if(diff <= 0) {
            
            console.log("deadline is passed");
            focusStatus = false;
        } else {
            deadline = result.dl;
            focusStatus = true;
            console.log(diff);
            setTimeout(() => {
                focusStatus = false;
            },diff)
            
        }
        console.log(focusStatus);
    })

    storage.get('rl', function (result) {
        if(!result.rl) {
            storage.set({'rl' : 'en'});
        }
        language = result.rl;
        goToBlockPage = goToBlockPage + "lang="+language;
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
            if(items[key] === "white"){
                whiteList[key] = items[key];
            }
            
        }    
    })
    
}


function addRules(rule,type) {

    storage.get(rule, function(value) {
        if(!value.key) {
            let obj = {}
           
           console.log(type);
            //let ids = (urlList.length > 0) ? urlList[urlList.length-1] : 0
            obj[rule] = type;
            storage.set(obj, function(data) {
                if(chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                    return;
                }
            })
            if(type==="url") {
                urlList[rule] = type;
            }else if(type === "word") {
                wordList[rule] = type;
            } else if(type === "white") {
                whiteList[rule] = type;
            }
        }
        else {
          
            console.log("already added as a " + value );
        }
    })  

}




function removeRule(rule) {
    storage.remove(rule, function() {
        if(urlList[rule]) {
            delete urlList[rule];
            console.log("deleted url: " + rule);
        }
        if(wordList[rule]) {
            delete wordList[rule];
            console.log("deleted word: " + rule);
        }
        if(whiteList[rule]) {
            delete whiteList[rule];
            console.log("delete whitelist url: " + rule);
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
    console.log("block + delete url : " + url);
}

function redirectPage(tabId, url) {
    
    //chrome.tabs.create({url: "blocked.html?url="+url, active: true});
    chrome.tabs.update(tabId, { url: goToBlockPage + "&url="+url});
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

function checkWord(title,text,url,tab) {
    
    let lowText = text.toLowerCase();
    let lowTitle = title.toLowerCase();
    let formatted = formatURL(url);
    console.log(title);
    if(!url.startsWith(blockPage)) {
        if(!whiteList[formatted]) {
            for (var key in wordList) {
            
                if(lowTitle.includes(key)) {
                    
                    deleteUrlHistory(formatted);
                    chrome.tabs.update(tab, { url: goToBlockPage+"&word="+key+"&url="+formatted });                
                    break;
                }
                if(lowText.includes(key)) {
                    console.log(lowText);
                    deleteUrlHistory(formatted);
                    chrome.tabs.update(tab, { url: goToBlockPage + "&word="+key+"&url="+formatted });
                    
                    
                    break;
                } 
            }
        }
    }
    
}

function startTimer(dl){
    let diff = new Date(dl) - new Date();
    focusStatus = true;
    console.log("focus: " + focusStatus);
    console.log(diff);
    
    if(diff > 0) {
        chrome.tabs.query({}, function(tabs) {
            tabs.forEach(function (tab) {
                tabUrl.set(tab.id,tab.url);
                console.log(tab.id + " with the url : " + tab.url)
                chrome.tabs.update(tab.id, { url: goToBlockPage + "&focus=true" });
            });
          
        })
    } 
    if(diff < 0) {
        clearTimeout(startDeadline);
        focusStatus = false;
            console.log("focus: " + focusStatus);

            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(function (tab) {
                    const pastUrl = tabUrl.get(tab.id);
                    console.log(pastUrl);
                    chrome.tabs.update(tab.id, {url : pastUrl} );
                });
            })
            //tabUrl.clear();
    }
        startDeadline = setTimeout(() => {
            focusStatus = false;
            console.log("focus: " + focusStatus);

            chrome.tabs.query({}, function(tabs) {
                tabs.forEach(function (tab) {
                    const pastUrl = tabUrl.get(tab.id);
                    console.log(pastUrl);
                    chrome.tabs.update(tab.id, {url : pastUrl} );
                });
            })
        }, diff)
    
    
        
    
    // else {
    //     clearTimeout(startDeadline);
    //     focusStatus = false;
    //     chrome.tabs.query({}, function(tabs) {
    //         tabs.forEach(function (tab) {
    //             const pastUrl = tabUrl.get(tab.id);
    //             console.log(tab.id + " with the url : " + pastUrl)
    //             console.log(pastUrl);
    //             chrome.tabs.update(tab.id, {url : pastUrl} );
    //         });
    //     })
    // }
    
}




getRules();
getStatus();




chrome.runtime.onMessage.addListener((msg = {}, sender) => {
    getRules();
    
    
    if(msg.action === 'addRule') {
        if(msg.url) {
            if(msg.type === "white") {
                if(!urlList[msg.url]) {
                    addRules(msg.url, msg.type);
                }
            } else {
                addRules(msg.url, "url");
            }
            
        }
        if(msg.word) {
            addRules(msg.word,"word");
        }
        
        chrome.runtime.sendMessage({
            status: "is blocked"
        });
        
    }

    if(msg.action === 'remove') {
        removeRule(msg.url);
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
        chrome.tabs.update(msg.tab, { url: goToBlockPage });
        
    }

    else if(msg.action === 'sendInformation') {
        checkWord(msg.title,msg.text,msg.url,msg.tab);
    }
    else if(msg.action === "startFocusTimer"){
        deadline = msg.deadline;
        storage.set({dl : deadline}, function() {
            
            console.log("show deadline" + new Date(deadline));
        });
        startTimer(deadline);
    }else if(msg.action === "changeLanguage"){
        console.log("from " + language + " to " + msg.lang );
        goToBlockPage = goToBlockPage.substring(0, goToBlockPage.length - 2);
        goToBlockPage = goToBlockPage + msg.lang;
        language = msg.lang;
        console.log(goToBlockPage);
    }
    
    chrome.runtime.sendMessage({
        action : "sendUrl",
        obj : urlList
    })

    chrome.runtime.sendMessage({
        action: "sendWhiteList",
        obj : whiteList
    })

    chrome.runtime.sendMessage({
        action : "sendWord",
        obj : wordList
    })

   
    
    
    
})


// chrome.tabs.onActivated.addListener(function (tabId, changeInfo, tab) {
//     if(tab.url?.startsWith("chrome://")) return undefined;
//         if(tab.url?.startsWith("chrome-extension://")) return undefined;
//         if(tab.url?.startsWith(blockPage)) return undefined;
//         if (statusApp) {
//             if(focusStatus) {
//                 chrome.tabs.update(tab.id, { url: "blocked.html?focus=true" });
                
//             }
//             else if (tab.url) {
//                 let blockPage = "chrome-extension://jpndajehapjaijkgibpmgbbppedelmca/blocked.html"
//                 if(!tab.url.startsWith(blockPage)) {
//                     let blockedWord = false;
//                     chrome.scripting.executeScript({
//                         target: {tabId: tabId},
//                         func : () => {
//                             let blockPage = "chrome-extension://jpndajehapjaijkgibpmgbbppedelmca/blocked.html"
//                             chrome.runtime.sendMessage({
//                                 action: 'sendInformation',
//                                 tab: window.tabId,
//                                 url : window.location.href,
//                                 title : document.title,
//                                 text : document.body.innerText
//                             })
                          
//                         }
            
                    
//                 })
//                 console.log("reloaded");
//                 checkURL(tab.url, tab.id);
                
                
            
//         }
//         }
//     }

// });


// chrome.tabs.onCreated.addListener(function (tab) {
    
//     if(tab.url?.startsWith("chrome://")) return undefined;
//         if(tab.url?.startsWith("chrome-extension://")) return undefined;
//         if(tab.url?.startsWith(blockPage)) return undefined;
//         if (statusApp) {
//             if(focusStatus) {
//                 chrome.tabs.update(tab.id, { url: "blocked.html?focus=true" });
                
//             }
//             else if (tab.url) {
//                 let blockPage = "chrome-extension://jpndajehapjaijkgibpmgbbppedelmca/blocked.html"
//                 if(!tab.url.startsWith(blockPage)) {
//                     let blockedWord = false;
//                     chrome.scripting.executeScript({
//                         target: {tabId: tab.id},
//                         func : () => {
//                             let blockPage = "chrome-extension://jpndajehapjaijkgibpmgbbppedelmca/blocked.html"
//                             console.log(window.tabId);
//                             chrome.runtime.sendMessage({
//                                 action: 'sendInformation',
//                                 tab: window.tabId,
//                                 url : window.location.href,
//                                 title : document.title,
                                
//                                 text : document.body.innerText
//                             })
                          
//                         }

//                 })
//                 console.log("reloaded");
//                 checkURL(tab.url, tab.id);
                
                
//             } 
//         }
//         }
// })
        

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
        
        if(tab.url?.startsWith("chrome://")) return undefined;
        if(tab.url?.startsWith("chrome-extension://")) return undefined;
        if(tab.url?.startsWith(blockPage)) return undefined;
        if (statusApp) {
            if(focusStatus) {
                chrome.tabs.update(tab.id, { url: goToBlockPage+"&focus=true" });
                return undefined;
            }
            else if (tab.url) {
                let blockPage = "chrome-extension://jpndajehapjaijkgibpmgbbppedelmca/blocked.html"
                if(!tab.url.startsWith(blockPage)) {
                    let blockedWord = false;
                    chrome.scripting.executeScript({
                        target: {tabId: tabId},
                        func : () => {
                            let blockPage = "chrome-extension://jpndajehapjaijkgibpmgbbppedelmca/blocked.html"
                            chrome.runtime.sendMessage({
                                action: 'sendInformation',
                                tab: window.tabId,
                                url : window.location.href,
                                title : document.title,
                                text : document.body.innerText
                            })
                          
                        }
            
                    
                })
                checkURL(tab.url, tab.id);
                
                
            
        }
        }
    }
  
    




   
})



