//往content-script发消息
function sendMessageToContentScript(message, callback) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
            if (callback) callback(response);
        });
    });
}

//截全图
function captureFull(callback) {
    chrome.tabs.captureVisibleTab(null, {},callback)
}

//扩展图标点击事件监听
chrome.action.onClicked.addListener(() => captureFull((base64Codes) => {
    sendMessageToContentScript({
        cmd: 'addMask',
        base64Codes
    }, function (response) {
        console.log('来自content的回复：' + response);
    })
}))

// 监听来自content-script的消息
// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//     if(request.cmd === "captureVisible"){
//         captureFull(function (base64Codes) {
//             sendMessageToContentScript({
//                 cmd: 'addMask',
//                 base64Codes
//             }, function (response) {
//                 console.log('来自content的回复：' + response);
//             })
//         })
//     }
// });
