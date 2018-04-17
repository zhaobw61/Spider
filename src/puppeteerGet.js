var puppeteer = require('puppeteer');
var saveData = require('./saveData');
//用于请求html
function puppeteerGet(url,fileName,callBack){
    (async()=>{
        var browser = await puppeteer.launch({});
        var page = await browser.newPage();
        await page.goto(url);
        var data = await page.evaluate(()=>document.body.innerHTML);
        await browser.close();
        // console.log('popo');
        // console.log(fileName,data);
        if(callBack){
            callBack(data);
        }
       
    })()
}
module.exports = puppeteerGet;
    