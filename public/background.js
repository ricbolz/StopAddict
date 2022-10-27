/*global chrome */
var storage = chrome.storage.sync;
console.log("extension loaded")
var urlList = {};


function getRules(){
    for (let i =0; i < urlList.length; i++) {
        urlList.splice(i,0);
    }
    
    
    chrome.declarativeNetRequest.getDynamicRules(function(rule) {
        let i = 0;
        let url;
        let id;
        
        while(i < rule.length) {
            let urls;
            let urlss;
            url = rule[i].condition.urlFilter;
            urls = url.split("||");
           
            if(urls[1]) {
                urlss = urls[1]
            } else {
                urlss = urls[0];
            }
            
            id = rule[i].id
            urlList[urlss] = id;
            console.log(urlss + " id: " + id);
            i++;
        }
    })
    console.log(urlList);
}


function addRules(url) {
    chrome.declarativeNetRequest.getDynamicRules(function(rule){
        let i = 0;
        let isFind = false;
        while(i < rule.length && !isFind) {
            if(url === rule[i].condition.urlFilter) {
                isFind = true;
            }
            i++;
        }
        let ids = (i === 0) ?  0 : rule[rule.length-1].id;
        ids = ids + 2;
        if(!isFind){
        chrome.declarativeNetRequest.updateDynamicRules(
            {
                addRules: [
                    {
                        action: {
                            type: "block",
                        },
                        condition: {
                            isUrlFilterCaseSensitive: false,
                            urlFilter:  url,
                            resourceTypes: ["main_frame"]
                        },
                        id: ids,
                        priority: 1,
                    },
                ],
                removeRuleIds : [ids],
            },
            () => {
                console.log(rule.length)
                console.log(url + "is blocked");
                
                urlList[url] = ids;
                console.log(url + " : " + urlList[url])
                
            }
            
        );
        } else {
            console.log("already blocked");
        }
    });

}

function removeURL(url) {
    chrome.declarativeNetRequest.updateDynamicRules(
        {
            removeRuleIds:[urlList[url]],
        },
        () => {
            delete urlList[url];
            console.log("delete success");
            console.log(urlList);
        }
    );
}

function clearRule() {
    for(var key in urlList) {
        chrome.declarativeNetRequest.updateDynamicRules({
            removeRuleIds:[urlList[key]]
        },
        () => {
            
            console.log("clear success");

        })
    }
    
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
        
        console.log(urlList);
        
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
        console.log(splitURL[2]);
        if(urlList[splitURL[2]]) {
            chrome.tabs.update(tabs[0].id, {url: "blocked.html"});
        }
    });
})




