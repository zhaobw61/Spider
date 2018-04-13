var axios = require('axios');
var fs = require('fs');
var path = require("path");
var http = require("http");

var BufferHelper = require('bufferhelper');

var iconv = require('iconv-lite'); 
// 新闻名称
var newName = '杭州保姆纵火案';
// 收索范围：all新闻全文 title新闻标题
var range = 'all';
// 收索类型
var c = 'news';
// 排序方法
var sort = 'time';

var url = 'http://search.sina.com.cn/?q='+newName+'&range='+range+'&c='+c+'&sort='+sort+'&ie=utf-8';

console.log(url);
(async()=>{
    var searchGet = axios.get(url);
    var searchGetPage;
    // console.log(path.resolve());
    searchGet.then(function(res){
        console.log(res.data);
        searchGetPage = res.data;
        console.log(iconv.decode(searchGetPage,'gb2312'));
        fs.writeFile('search.html',searchGetPage,{encoding:'gb2312'},function(){
            console.log('saveSucces');
        })
    })
    searchGet.catch(function(){
        console.log('searchError');
    })
})()
