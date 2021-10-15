async function getOcrData({file_base64, file_name}={}) {
    let request = {
        data: {
            type   : 'common_ocr',
            param  : {
                'staffname'  : 'wanted_order',
                'file_name'  : file_name,
                'file_base64': file_base64.replace(/^data:image\/\w+;base64,/, "")   //去掉base64位头部
            }
        },
        method : 'POST',
        headers: {'Content-Type': 'application/json'}
    }
    let res = await http(request);
    return JSON.parse(res.data)
}
