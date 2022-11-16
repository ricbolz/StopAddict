function returnBack(){
    window.history.go(-3);
    
}


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
            var reason = document.getElementById('reason');
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const url = urlParams.get("url") 
            const word = urlParams.get("word");
            //document.title = url + " blocked";
            if(word) {
                root.innerText = "blocked website : " + url;
                reason.innerText = `blocked reason: it is contain restricted word "` + word + `"`;

            } else if(url){
                root.innerText = "blocked website : " +  url;
                reason.innerText = `blocked reason: accessed blocked url "` + url +`"`;
            } else {
                root.innerText = "You are accessing the Block page"
            }
            window.history.pushState(null,"a","blocked.html");
            console.log("loaded");
            // var ret = document.getElementById('return');
            // ret.addEventListener('click',returnBack,false);
})