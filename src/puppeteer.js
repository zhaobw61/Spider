//puppeteer
var puppeteer = require('puppeteer');
var cheerio = require('cheerio');
var fs = require("fs");
(async()=>{
    var browser = await puppeteer.launch({});
    var page = await browser.newPage();
    await page.goto('https://www.bilibili.com/ranking');
    // console.log(page);
    var html = await page.evaluate(()=>document.body.innerHTML);
    // console.log(html);
    await browser.close();
    fs.writeFile('index.html',html,function(){
        console.log('create file ok');
    })
    console.log(1);
    var $ = cheerio.load(html);

    var rankList = $('.rank-list');
    var rt = rankList.find('.title')
    var con = "";
    for(var i=0;i<rt.length;i++){
        con += $(rt[i]).text();
        con += '\r';
    }
    console.log(2);
    fs.writeFile('rt.md',con,function(){
        console.log('con--ok');
    })

    // console.log(rt);

})()