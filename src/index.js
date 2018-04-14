var http = require("http");
var fs = require('fs');
var BufferHelper = require('bufferhelper');
var iconv = require('iconv-lite'); 

var cheerio = require('cheerio');

var puppeteer = require('puppeteer');

var path = require('path');
// 新闻名称
var newName = '杭州保姆纵火案';
// 收索范围：all新闻全文 title新闻标题
var range = 'all';
// 收索类型
var c = 'news';
// 排序方法
var sort = 'time';

var url = 'http://search.sina.com.cn/?q='+newName+'&range='+range+'&c='+c+'&sort='+sort+'&ie=utf-8';
var urlofInout = 'http://search.sina.com.cn/?q=杭州保姆纵火案&c=news&from=channel&ie=utf-8'
console.log(url);

(async()=>{
    var browser = await puppeteer.launch({});
    var page = await browser.newPage();
    await page.goto(urlofInout);
    var html = await page.evaluate(()=>document.body.innerHTML);
    // console.log(html);
    await browser.close();
    var $ = cheerio.load(html);

    var rankList = $('#wrap');
    var dirPath = path.resolve();
    console.log();
    fs.writeFile(dirPath+'/saveSearch/rankList.html',rankList,function(){
        console.log('create file ok');
    })
   
})()
