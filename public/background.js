/*global chrome */
var storage = chrome.storage.local;
console.log("extension loaded")
var urlList = {};



function getRules(){
    for (let i =0; i < urlList.length; i++) {
        urlList.splice(i,0);
    }
    storage.get(null, function(items) {
        var allKeys = Object.keys(items);
        for(var key in items) {
            urlList[key] = items[key];
        }
        console.log(allKeys);
    })
    console.log(urlList);
}


function addRules(url) {

    storage.get(url, function(value) {
        if(!value.key) {
            let obj = {}
            let ids = (urlList.length > 0) ? urlList[urlList.length-1] : 0
            obj[url] = ids + 1;
            storage.set(obj, function(data) {
                if(chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError.message);
                    return;
                }
            })
        }
        else {
            console.log("already blocked");
        }
    })
    
    

}

function removeURL(url) {

    storage.remove(url, function() {
        delete urlList[url];
        console.log("deleted" + url);
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
getRules();
console.log(urlList);

chrome.runtime.onMessage.addListener(async (msg = {}, sender) => {
    getRules();
    
    if(msg.action === 'block') {
       
        addRules(msg.url);
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

    if(msg.action === "clear") {
        clearRule();
        chrome.runtime.sendMessage({
            status: msg.url+ " clear success"
        })
        
    }
    if(msg.action === 'getUrl') {
        
        //console.log(urlList);
        
    }

    
    chrome.runtime.sendMessage({
        action : "sendUrl",
        obj : urlList
    })

    
    
    
})


chrome.tabs.onActivated.addListener(function (tabId) {
    const queryInfo = {active: true, lastFocusedWindow: true};
    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
        const url = tabs[0].url;
        let splitURL = url.split("/")
        console.log(splitURL[2]);
        if(urlList[splitURL[2]]) {
            chrome.tabs.update(tabs[0].id, {url: "blocked.html"});
        }
    });
    
});

chrome.tabs.onUpdated.addListener(function(tabId) {
    const queryInfo = {active: true, lastFocusedWindow: true};
    chrome.tabs && chrome.tabs.query(queryInfo, tabs => {
        const url = tabs[0].url;
        let splitURL = url.split("/")
        let splitURL2 = splitURL[2].split(".");
        console.log(splitURL[2]);
        if(urlList[splitURL[2]]) {
            
            chrome.tabs.update(tabs[0].id, {url: "blocked.html"});
        }
    });
})




