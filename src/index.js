var BufferHelper = require('bufferhelper');
var iconv = require('iconv-lite'); 

var cheerio = require('cheerio');

var puppeteer = require('puppeteer');

var saveData = require('./saveData');

var readFile = require('./readFile');
// 新闻名称
var newName = '杭州保姆纵火案';
// 收索范围：all新闻全文 title新闻标题
var range = 'all';
// 收索类型
var c = 'news';
// 排序方法
var sort = 'time';

var url = 'http://search.sina.com.cn/?q='+newName+'&range='+range+'&c='+c+'&sort='+sort+'&ie=utf-8';
var urlofInout = 'http://search.sina.com.cn/?q=杭州保姆纵火案&c=news&from=channel&ie=utf-8';
// console.log(url);

(async()=>{
    // var browser = await puppeteer.launch({});
    // var page = await browser.newPage();
    // await page.goto(urlofInout);
    // var html = await page.evaluate(()=>document.body.innerHTML);
    // await browser.close();
    // saveData('/saveSearch/inputSearch.html',html);

    // var searchRes = readFile('/saveSearch/inputSearch.html');
    
    // var $ = cheerio.load(searchRes,{decodeEntities: false});
    // var newList = $("#wrap").find('#result').find('.box-result');
    // var tempArr = [];
    // var tempObj;
    // for(var i=0;i<newList.length;i++){
    //     tempObj = {}
    //     console.log($(newList[i]).find('h2').children('a').text());
    //     tempObj.newUrl = $(newList[i]).find('h2').children('a').attr('href');
    //     tempObj.newName = $(newList[i]).find('h2').children('a').text();
    //     tempObj.content = $(newList[i]).find('.content').text();
    //     tempArr.push(tempObj);
    // }
    // saveData('/saveSearch/newslist.md',tempArr);
    
    var browser = await puppeteer.launch({});
    var page = await browser.newPage();
    await page.goto('http://news.sina.com.cn/o/2018-02-24/doc-ifyrvaxf0115990.shtml');
    // var html = await page.evaluate(()=>document.body.innerHTML);
    await browser.close();
    saveData('/saveSearch/newDetial.html',html);
})()
