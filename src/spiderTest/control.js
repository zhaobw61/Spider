var axios = require('axios');
var fs = require('fs');
var path = require("path");
var http = require("http");

var BufferHelper = require('bufferhelper');

var iconv = require('iconv-lite'); 

var Icon = require('buffer');

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
    searchGet.then(function(res){
        searchGetPage = res.data;
        fs.writeFile('search.html',searchGetPage,function(){
            console.log('saveSucces');
        })
    })
    searchGet.catch(function(){
        console.log('searchError');
    })
})()
