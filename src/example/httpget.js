// http.get(url,function(res){
//     var bufferHelper = new BufferHelper();
//     res.on('data', function (chunk) {
//         console.log(chunk);
//         console.log("");
//         bufferHelper.concat(chunk);
//     });
//     res.on('end',function(){ 
//         console.log(bufferHelper);
//         console.log(iconv.decode(bufferHelper.toBuffer(),'GBK'));
//     });
// })
var iconv = require('iconv-lite'); 

var http = require('http');

var BufferHelper = require('bufferhelper');

var saveData = require('./saveData');
http.get('http://search.sina.com.cn/?q=杭州保姆纵火案&range=all&c=news&sort=time&ie=utf-8',function(res){
    var bufferHelper = new BufferHelper();
    res.on('data', function (chunk) {
        bufferHelper.concat(chunk);
    });
    res.on('end',function(){
        var decodeHtml = iconv.decode(bufferHelper.toBuffer(),'gb2312'); 
        console.log("getEnd");
        // 转码后的HTML
        saveData('/saveSearch/testHttp.html',decodeHtml);
    });
});