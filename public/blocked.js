
function returnBack(){
    window.history.go(-3);
    
}

const dict_en = {
    "BlockPage" : {
        "root_default" : "You are accessing the Block page",
        "root_website" : "blocked website : ",
        "root_focus" : "blocked all website in focus mode ",
        "reason_focus" : "Focus mode has activated",
        "reason_website" : "blocked reason: accessed blocked url ",
        "reason_word": "blocked reason: it is contain restricted word ",
        "title" : "BLOCKED PAGE",
        "message" : "What are you doing in here? Get out !!",
        "visit_github_page" : "Visit github page:"
    },
}

const dict_jp = {
    "BlockPage" : {
        "root_default" : "ブロックページをアクセスする",
        "root_website" : "ブロックしたサイト : ",
        "root_focus" : "集中モード内すべてのサイトをアクセスできない ",
        "reason_focus" : "集中モードが作動されている",
        "reason_website" : "理由 : ブロックされたサイト",
        "reason_word": "理由: NG単語",
        "title" : "ブロックページ",
        "message" : "ここに何用だ？",
        "visit_github_page" : "Githubにアクセス:"
    },
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
            var message = document.getElementById('message');
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const url = urlParams.get("url") 
            const word = urlParams.get("word");
            const focus = urlParams.get("focus");
            const lang = urlParams.get("lang");
            const dict = (lang === "jp" ? dict_jp : dict_en);
            //document.title = url + " blocked";
            message.innerText = dict.BlockPage.message;
            if(word) {
                
                root.innerText = dict.BlockPage.root_website + url;
                reason.innerText = dict.BlockPage.reason_word + ` "` + word + `"`;

            } 
            else if(focus){
                root.innerText = dict.BlockPage.root_focus;
                reason.innerText = dict.BlockPage.reason_focus;

            }else if(url){
                root.innerText = dict.BlockPage.root_website +  url;
                reason.innerText = dict.BlockPage.reason_website + `"` + url +`"`;
            } else {
                root.innerText = dict.BlockPage.root_default;
            }
            window.history.pushState(null,"a","blocked.html");
            console.log("loaded");
            // var ret = document.getElementById('return');
            // ret.addEventListener('click',returnBack,false);
})