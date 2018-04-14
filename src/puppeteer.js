//puppeteer
var puppeteer = require('puppeteer');
var cheerio = require('cheerio');
var fs = require("fs");
(async()=>{
    var browser = await puppeteer.launch({});
    var page = await browser.newPage();
    await page.goto('http://search.sina.com.cn/?q=杭州保姆纵火案&c=news&from=channel&ie=utf-8');
    
    var html = await page.evaluate(()=>document.body.innerHTML);
    // console.log(html);
    await browser.close();

    var $ = cheerio.load(html);

    var rankList = $('#wrap');
    // var rt = rankList.find('.title')
    // var con = "";
    // for(var i=0;i<rt.length;i++){
    //     con += $(rt[i]).text();
    //     con += '\r';
    // }
    fs.writeFile('rt.md',rankList,function(){
        console.log('con--ok');
    })

    // console.log(rt);

})()