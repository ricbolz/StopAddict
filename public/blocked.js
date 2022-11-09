

document.addEventListener('DOMContentLoaded', function() {
    // chrome.runtime.onMessage.addListener((msg={}, sender) => {
    //     if(msg.action === "sendReason") {
    //         let reason = msg.url || msg.word;
    //         console.log(reason + "will blocked");
    //         var root = document.getElementById('root');
    //         const queryString = window.location.search;
    //         const urlParams = new URLSearchParams(queryString);
    //         const url = urlParams.get("url")
    //         document.title = reason + " blocked";
    //         root.innerText = "blocked " + reason;
    //         console.log("loaded");
    //     }
        
    // })
    
            var root = document.getElementById('root');
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const url = urlParams.get("url") || urlParams.get("word");
           
            document.title = url + " blocked";
            root.innerText = "blocked " + url;
            window.history.pushState(null,"a","blocked.html");
            console.log("loaded");
})