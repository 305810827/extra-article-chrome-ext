console.log('content_script')

function createEl(tagName = 'div') {
    return document.createElement(tagName)
}

let mask        = createEl();
let container   = createEl();
let tools       = createEl();
let closeBtn    = createEl('span')
let confirmBtn  = createEl('span')
let ocrBtn      = createEl('span')
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
    ocrBtn      = createEl('span')
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
    ocrBtn.classList.add('iconfont','icon-x-ocr')
    closeBtn.title     = '取消'
    confirmBtn.title   = '确定'
    ocrBtn.title       = 'OCR识别'
    closeBtn.addEventListener('click', close)
    confirmBtn.addEventListener('click', confirm)
    ocrBtn.addEventListener('click',ocr)

    tools.appendChild(closeBtn)
    tools.appendChild(ocrBtn)
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
    let dpr = devicePixelRatio || 1;
    let elx = targetEL().getBoundingClientRect().x
    let ely = targetEL().getBoundingClientRect().y
    clippingImage(base64Image, (pos.x - elx) * dpr, (pos.y + ely) * dpr, elWidth * dpr, elHeight * dpr, base64Result => {
        localStorage.setItem('imageBase64',base64Result)
        for (let i = 0; i < window.frames.length; i++) {
            window.frames[i].postMessage({cmd: 'pasteImage', base64Result}, '*')
        }
        const blobInput = convertBase64ToBlob(base64Result,'image/png')
        const clipboard = navigator.clipboard;
        if(clipboard){
            const data      = [new ClipboardItem({['image/png']:blobInput})];
            clipboard.write(data).then(() => {
                console.log('success')
            }, (err) => {
                console.log('failed')
            })
        }
    })
    removeMask()
}

function close(e) {
    e.stopPropagation();
    removeMask()
}

function ocr(e) {
    e.stopPropagation();
    let dpr = devicePixelRatio || 1;
    let elx = targetEL().getBoundingClientRect().x
    let ely = targetEL().getBoundingClientRect().y
    clippingImage(base64Image, (pos.x - elx) * dpr, (pos.y + ely) * dpr, elWidth * dpr, elHeight * dpr, async base64Result => {
        const res = await getOcrData({
            file_base64: base64Result,
            file_name  : `img${Math.random().toString().substr(2, 6)}`
        })
        mask.removeChild(container)
        addOcrDataToPage(res.value)
    })
}

function addOcrDataToPage(data){
    if(!data.length)return;
    let ocrBox = createEl()
    let ocrList = createEl('ul')
    let ocrTools = createEl()
    let closeBtn = createEl('span')
    let copyAllBtn = createEl('span')
    let input = createEl('input')

    ocrBox.classList.add('x-ocrBox')
    ocrTools.classList.add('x-ocrTool')
    ocrBox.style.top = pos.y + 'px'
    ocrBox.style.left = pos.x + 'px'
    ocrTools.style.top = '-2px';
    ocrTools.style.right = '-23px';
    for (let item of data) {
        input.value += item
        let li = createEl('li')
        li.innerText = item
        ocrList.appendChild(li)
    }

    closeBtn.title = '关闭'
    copyAllBtn.title = '复制全部'
    closeBtn.classList.add('iconfont', 'icon-x-close')
    copyAllBtn.classList.add('iconfont','icon-x-copy')
    input.classList.add('x-myInput')
    closeBtn.addEventListener('click',close)
    copyAllBtn.addEventListener('click',copyAll)

    ocrTools.appendChild(closeBtn)
    ocrTools.appendChild(copyAllBtn)
    ocrBox.appendChild(ocrList)
    ocrBox.appendChild(ocrTools)
    ocrBox.appendChild(input)
    mask.appendChild(ocrBox)
}

function copyAll(){
    let input = document.querySelector('input.x-myInput')
    input && input.select()
    document.execCommand('copy') && message('复制成功')
}

function startCapture(e) {
    pos.x = e.offsetX;
    pos.y = e.offsetY;
    container.style.top = pos.y + 'px';
    container.style.left = pos.x + 'px';
    container.style.width = '0';
    container.style.height = '0';
    mask.addEventListener('mousemove', isMoving)
}

function endCapture() {
    mask.removeEventListener('mousemove', isMoving)
    mask.removeEventListener('mousedown', startCapture)
    mask.style.cursor = 'default'
    tools.classList.add('show')
}

function isMoving(e) {
    let timer;
    if (timer) return;
    timer = setTimeout(() => {
        if(e.offsetX < pos.x){
            elWidth = e.offsetX
        }else {
            elWidth = e.offsetX - pos.x;
        }
        if(e.offsetY < pos.y){
            elHeight = e.offsetY
        }else {
            elHeight = e.offsetY - pos.y;
        }
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

let iframe   = createEl('iframe');
let id       = parseInt(location.search.replace(/\?src_id=/g,''));
let url      = location.origin + location.pathname;
iframe.src   = `https://wanted-order.woa.com:8080/record/sidewall?id=${id}&url=${url}`;
// iframe.src   = `https://192.168.255.10:8080/record/sidewall?id=${id}&url=${url}`;    //测试环境
iframe.allow = "clipboard-read; clipboard-write";
iframe.classList.add('x-iframe');
// iframe.sandbox ="allow-same-origin;"

if(id){
    document.body.style.paddingRight = '300px'
    document.querySelector("html").appendChild(iframe)
}
// setTimeout(()=>{
//     window.postMessage({content:'content_script'},'*')
// },3000)
// window.addEventListener('message', (e) => {
//     if (e.data === 'sendToContentScript') {
//         // 向background发送消息 截全图
//         chrome.runtime.sendMessage({cmd:'captureVisible'},(res)=>{})
//     }
// })
