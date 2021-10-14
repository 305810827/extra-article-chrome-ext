function message(text) {
    let messageBox = createEl()
    let tag = createEl('span')
    let txt = createEl('span')
    tag.classList.add('iconfont', 'icon-x-correct')
    txt.innerText = text
    messageBox.classList.add('x-success-message')
    messageBox.appendChild(tag)
    messageBox.appendChild(txt)
    mask.appendChild(messageBox)
    setTimeout(() => {
        mask.removeChild(messageBox)
    }, 3000)
}
