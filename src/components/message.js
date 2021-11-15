function message(type='success',text) {
    let messageBox = createEl()
    let tag = createEl('span')
    let txt = createEl('span')
    txt.innerText = text
    messageBox.id = 'xs-message'
    if(type === 'success'){
        tag.classList.add('iconfont', 'icon-xs-correct')
        messageBox.classList.add('x-success-message')
    }else if(type === 'error'){
        tag.classList.add('iconfont', 'icon-xs-error')
        messageBox.classList.add('x-error-message')
    }else if (type === 'warning'){
        tag.classList.add('iconfont', 'icon-xs-warning')
        messageBox.classList.add('x-warning-message')
    }
    messageBox.appendChild(tag)
    messageBox.appendChild(txt)
    targetEL().appendChild(messageBox)
    setTimeout(() => {
        targetEL().removeChild(messageBox)
    }, 4000)
}
