var BufferHelper = require('bufferhelper');
var http = require('http');
var iconv = require('iconv-lite'); 

var cheerio = require('cheerio');

var axios = require('axios');

var puppeteer = require('puppeteer');

var saveData = require('./saveData');

var readFile = require('./readFile');

var url = require("url");
// 新闻名称
var newName = '杭州保姆纵火案';
// 收索范围：all新闻全文 title新闻标题
var range = 'all';
// 收索类型
var c = 'news';
// 排序方法
var sort = 'time';

// var url = 'http://search.sina.com.cn/?q='+newName+'&range='+range+'&c='+c+'&sort='+sort+'&ie=utf-8';
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
    // 请求搜索页面的数据
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

    // puppeteer请求新闻详细页面 头部的meta消失了怀疑是js干的
    // var browser = await puppeteer.launch({});
    // var page = await browser.newPage();
    // await page.goto('http://news.sina.com.cn/c/nd/2018-03-08/doc-ifxpwyhv6490183.shtml');
    // var html = await page.evaluate(()=>document.body.innerHTML);
    // await browser.close();
    // saveData('/saveSearch/puppeteerNewDetial.html',html);

    // http请求新闻详细页面目的是为了获取meta里的信息
    // http.get('http://news.sina.com.cn/c/nd/2018-03-08/doc-ifxpwyhv6490183.shtml',function(res){
    //     var bufferHelper = new BufferHelper();
    //     res.on('data', function (chunk) {
    //         bufferHelper.concat(chunk);
    //     });
    //     res.on('end',function(){
    //         var decodeHtml = iconv.decode(bufferHelper.toBuffer(),'utf-8'); 
    //         console.log("getEnd");
    //         // 转码后的HTML
    //         saveData('/saveSearch/httpNewDetial.html',decodeHtml);
    //     });
    // });
    // 读取http请求的新闻详细页面 为拼接出 请求评论的url
    // var httpNewDetial = readFile('/saveSearch/httpNewDetial.html');
    // var $ = cheerio.load(httpNewDetial,{decodeEntities: false});
    // var metaArr = $('meta[name="sudameta"]');
    // var aR = [];
    // for(var i=0;i<metaArr.length;i++){
    //     var aK = $(metaArr[i]).attr("content");
    //     if (aK) {
    //         if (aK.indexOf(";") != -1) {
    //             var D = aK.split(";");
    //             for (var aH = 0; aH < D.length; aH++) {
    //                 var aP = aw(D[aH]);
    //                 if (!aP) {
    //                     continue
    //                 }
    //                 aR.push(aP)
    //             }
    //         } else {
    //             aR.push(aK)
    //         }
    //     }
    // }
    // function aw(aH) {
    //     if (typeof aH !== "string") {
    //         throw "trim need a string as parameter"
    //     }
    //     var e = aH.length;
    //     var D = 0;
    //     var i = /(\u3000|\s|\t|\u00A0)/;
    //     while (D < e) {
    //         if (!i.test(aH.charAt(D))) {
    //             break
    //         }
    //         D += 1
    //     }
    //     while (e > D) {
    //         if (!i.test(aH.charAt(e - 1))) {
    //             break
    //         }
    //         e -= 1
    //     }
    //     return aH.slice(D, e)
    // }
    // // console.log(aR);
    // var tempObj = {};
    // for(var i=0;i<aR.length;i++){
    //     var tempArr = aR[i].split(":");
    //     tempObj[tempArr[0]] = tempArr[1];
    // }
    // console.log(tempObj);
    // var commentsArrUrl = 'http://comment5.news.sina.com.cn/page/info?version=1&format=js&channel='+tempObj['comment_channel']+'&newsid='+tempObj['comment_id']+'&group=&compress=0&ie=gbk&oe=gbk&page=1&page_size=20';
    // console.log(commentsArrUrl);

    var commentsArrUrl = 'http://comment5.news.sina.com.cn/page/info?version=1&format=js&channel=gn&newsid=comos-fxpwyhv6490183&group=&compress=0&ie=gbk&oe=gbk&page=1&page_size=20'
    http.get(commentsArrUrl,function(res){
        var html = "";
        var bufferHelper = new BufferHelper();
        res.on('data', function (chunk) {
            // bufferHelper.concat(chunk);
            html += chunk;
        });
        res.on('end',function(){
            // html=iconv.decode(bufferHelper.toBuffer(),'unicode');
            // saveData('/saveSearch/commentsArr2.md',html);
            console.log(typeof(html));
            eval(html);
            // console.log(data);
            saveData('/saveSearch/commentsArr1.md',data);
        });
    });
    // (async () => {
    //     const res = await axios.get('http://comment5.news.sina.com.cn/page/info?version=1&format=json&channel=gn&newsid=comos-fxpwyhv6490183&group=&compress=0&ie=gbk&oe=gbk&page=1&page_size=20');
    //     console.log(res);
    //     saveData('/saveSearch/阿萨德.md',res.data);
    // })()
})()
