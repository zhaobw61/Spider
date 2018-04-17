var http = require('http');
var iconv = require('iconv-lite'); 
var BufferHelper = require('bufferhelper');
var saveData = require('./saveData');

function httpGet(url,filename,callback){
    http.get(url,function(res){
        var bufferHelper = new BufferHelper();
        res.on('data', function (chunk) {
            bufferHelper.concat(chunk);
        });
        res.on('end',function(){
            var decodeHtml = iconv.decode(bufferHelper.toBuffer(),'utf-8'); 
            console.log("getEnd");
            callback(decodeHtml);
        });
    });
}
module.exports = httpGet;