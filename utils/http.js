async function http (request) {
    let nonce = ''
    for(let i = 0; i < 6; i++) {
        nonce += Math.floor(Math.random()*10);
    }
    let timestamp = new Date().getTime()
    let SHA256 = sha256js(`appid=webapp&appkey=615c64a2eefc4c9a&data=${JSON.stringify(request.data)}&nonce=${parseInt(nonce)}&timestamp=${timestamp}`)
    let res = await fetch('http://api.evidence.woa.com/1.0/openapi', {
        body: JSON.stringify({
            appid: 'webapp',
            data: JSON.stringify(request.data),
            sign: SHA256,
            timestamp: timestamp,
            nonce: parseInt(nonce),
            msg_no : "MSG123",
        }),
        headers: request.headers ? request.headers : {
            'content-type': 'application/json',
        },
        method: request.method ? request.method : 'GET'
    })
    return res.json()
}
