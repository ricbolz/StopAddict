/*global chrome */
var storage = chrome.storage.sync;
console.log("extension loaded")
var urlList = {};


function getRules(){
    for (var key in  urlList) {
        delete urlList[key];
    } 
    
    chrome.declarativeNetRequest.getDynamicRules(function(rule) {
        let i = 0;
        let url;
        let id;
        
        while(i < rule.length) {
            url = rule[i].condition.urlFilter;
            id = rule[i].id
            urlList[url] = id;
            console.log(url + " id: " + id);
            i++;
        }
    })
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
                            urlFilter: url,
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
    if(msg.action === 'block') {
       
        addRules(msg.url);
        chrome.runtime.sendMessage({
            status: "is blocked"
        });
       
    }

    if(msg.action === 'remove') {
        removeURL(msg.url);
        chrome.runtime.sendMessage({
            status: "remove success"
        });
    }

    if(msg.action === "clear") {
        clearRule();
        chrome.runtime.sendMessage({
            status: "clear success"
        })
    }
    if(msg.action === 'getUrl') {
        getRules();
        chrome.runtime.sendMessage({
            action : "sendUrl",
            obj : urlList
        })
    }
    
})






