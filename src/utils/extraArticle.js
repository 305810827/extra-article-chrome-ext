export default (clearInnerHTML) => {
    const blocksWidth = 3
    const text_len = []
    console.log(clearInnerHTML, 'clearInnerHTML');
    let lines = clearInnerHTML.split('$%^&xyj')
    console.log(lines, 'lines');
    lines.forEach(t => {
        /^\s+$/.test(t.toString()) && (t = '')
    });
    console.log(lines);
    for (let i = 0; i < lines.length - blocksWidth; i++) {
        let wordsLength = 0
        for (let j = i; j < i + blocksWidth; j++) {
            lines[j] = lines[j] && lines[j].replace(/\s/g, '')
            wordsLength += lines[j] ? lines[j].length : 0
        }
        text_len.push(wordsLength)
    }
    console.log(text_len);

    // 是否开始标识
    let boolStart = false
    // 是否结束标识
    let boolEnd = false
    // 开始正文text_len下标
    let start = -1
    // 结束正文text_len下标
    let end = -1
    // 提取的正文内容
    let main_text = []
    if (text_len.length < blocksWidth) return '没有正文'

    for (let i = 0; i < text_len - blocksWidth; i++) {
        // 判断正文开始点
        if (text_len[i] > 10 && !boolStart) {
            if(text_len[i+1].length > 0 && text_len[i+2].length > 0 && text_len[i+3].length > 0) {
                boolStart = true
                start = i
                continue
            }
        }

        // 判断正文结束点
        if (boolStart && (text_len[i+1].length === 0 || text_len[i+2].length === 0 || text_len[i+3].length === 0)) {
            boolEnd = true
            end = i
        }

        // 判断是否还有正文内容
        if(boolEnd) {
            let str = ''
            for (let j = start; j <= end; j++) {
                str += lines[j]
            }
            if (/Copyright|版权所有/gi.test(str)) continue
            main_text.push(str)
            boolStart = boolEnd = false
        }
    }
    return main_text

}
