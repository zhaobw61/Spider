http.get(url,function(res){
    var bufferHelper = new BufferHelper();
    res.on('data', function (chunk) {
        console.log(chunk);
        console.log("");
        bufferHelper.concat(chunk);
    });
    res.on('end',function(){ 
        console.log(bufferHelper);
        console.log(iconv.decode(bufferHelper.toBuffer(),'GBK'));
    });
})