console.log('content_script')

function createEl(tagName = 'div') {
    return document.createElement(tagName)
}

let mask        = createEl();
let container   = createEl();
let tools       = createEl();
let closeBtn    = createEl('span')
let confirmBtn  = createEl('span')
let pos         = {x: 0, y: 0}
let elWidth, elHeight
let base64Image
let targetEL = () => document.querySelector('#x-iframe') || document.body;

function init(){
    mask        = createEl();
    container   = createEl();
    tools       = createEl();
    closeBtn    = createEl('span')
    confirmBtn  = createEl('span')
    pos         = {x: 0, y: 0}
    elWidth     = 0;
    elHeight    = 0;
}

function addMask() {
    document.querySelector('div.x-mask') && removeMask()
    mask.classList.add('x-mask');
    container.classList.add('x-container')
    tools.classList.add('x-tools')
    closeBtn.classList.add('iconfont', 'icon-x-close')
    confirmBtn.classList.add('iconfont', 'icon-x-right')
    closeBtn.addEventListener('click', close)
    confirmBtn.addEventListener('click', confirm)

    tools.appendChild(closeBtn)
    tools.appendChild(confirmBtn)
    container.appendChild(tools);
    mask.appendChild(container);
    mask.addEventListener('mousedown', startCapture)
    mask.addEventListener('mouseup', endCapture)
    targetEL().appendChild(mask)
}

function removeMask() {
    targetEL().removeChild(document.querySelector('div.x-mask'))
}

function confirm(e) {
    e.stopPropagation();
    console.log('confirm')
    let dpr = devicePixelRatio || 1;
    let elx = targetEL().getBoundingClientRect().x
    console.log(elx,dpr)
    clippingImage(base64Image, (pos.x-elx) * dpr, (pos.y+60) * dpr, elWidth * dpr, elHeight * dpr, base64Result => {
        window.postMessage({cmd:'receiveFromContentScript',base64Result},'*')
        localStorage.setItem('imageBase64',base64Result)
        // const blobInput = convertBase64ToBlob(base64Result,'image/png')
        // const data = [new ClipboardItem({['image/png']:blobInput})];
        // navigator.clipboard.write(data).then(() => {
        //     console.log('success')
        // }, (err) => {
        //     console.log('failed')
        // })
    })
    removeMask()
}

function close(e) {
    e.stopPropagation();
    removeMask()
}

function startCapture(e) {
    console.log('startCapture')
    pos.x = e.offsetX;
    pos.y = e.offsetY;
    container.style.width = '0';
    container.style.height = '0';
    document.addEventListener('mousemove', isMoving)
}

function endCapture() {
    console.log('endCapture')
    document.removeEventListener('mousemove', isMoving)
    mask.removeEventListener('mousedown', startCapture)
    mask.style.cursor = 'default'
    tools.classList.add('show')
}

function isMoving(e) {
    let timer;
    if (timer) return;
    mask.style.cursor = 'crosshair'
    timer = setTimeout(() => {
        container.style.top = pos.y + 'px';
        container.style.left = pos.x + 'px';
        elWidth = e.offsetX - pos.x;
        elHeight = e.offsetY - pos.y;
        container.style.width = elWidth + 'px';
        container.style.height = elHeight + 'px';
        timer = undefined;
    }, 30)
}

function convertBase64ToBlob(base64, type) {
    //base64去掉data:image/gif;base64,才可转为blob
    let bytes = window.atob(base64.substring(base64.indexOf(',')+1));
    let ab = new ArrayBuffer(bytes.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }
    return new Blob([ab], { type: type });
}

function clippingImage(base64Codes, x, y, width, height, callback) {
    let img           = new Image();
    img.src           = base64Codes;
    let canvas        = document.createElement('canvas');
    let ctx           = canvas.getContext('2d');
    let createw       = document.createAttribute('width');
    let createh       = document.createAttribute('height');
    createw.nodeValue = width;
    createh.nodeValue = height;
    canvas.setAttributeNode(createh);
    canvas.setAttributeNode(createw);
    img.onload = function () {
        ctx.drawImage(img,x,y,width,height,0,0,width,height);
        let base64Result = canvas.toDataURL('image/png', 1);
        callback(base64Result)
    }
}

// get background info
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.cmd === 'addMask') {
        base64Image = request.base64Codes
        init()
        addMask()
    }
    sendResponse('收到了background.js的消息~')
});
// setTimeout(()=>{
//     window.postMessage({content:'content_script'},'*')
// },3000)
// window.addEventListener('message', (e) => {
//     if (e.data === 'sendToContentScript') {
//         // 向background发送消息 截全图
//         chrome.runtime.sendMessage({cmd:'captureVisible'},(res)=>{})
//     }
// })
