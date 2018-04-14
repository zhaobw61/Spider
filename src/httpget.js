http.get(url,function(res){
    var bufferHelper = new BufferHelper();
    res.on('data', function (chunk) {
        console.log(chunk);
        console.log("");
        bufferHelper.concat(chunk);
    });
    res.on('end',function(){ 
        console.log(bufferHelper);
        // console.log(iconv.decode(bufferHelper.toBuffer(),'GBK'));
    });
})

http.get(urlofInout,function(res){
    var bufferHelper = new BufferHelper();
    res.on('data', function (chunk) {
        bufferHelper.concat(chunk);
    });
    res.on('end',function(){
        var decodeHtml = iconv.decode(bufferHelper.toBuffer(),'GBK'); 
        console.log("getEnd");
        // 转码后的HTML
        fs.writeFile('search.html',decodeHtml,function(){
            console.log('saveSucces');
        });
    });
});