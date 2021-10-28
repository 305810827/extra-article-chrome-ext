let tag;

function addAlwaysOnTopTag() {
    tag = createEl()
    tag.classList.add('alwaysOnTop')
    tag.innerText = 'Screener is running~~'
    targetEL().appendChild(tag)
}

function removeTags() {
    tag && targetEL().removeChild(tag)
}
