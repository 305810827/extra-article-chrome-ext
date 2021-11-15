console.log('content_script')
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    sendResponse(document.documentElement.innerHTML)
})
