var puppeteer = require('puppeteer');
//用于请求html
function puppeteerGet(url,callBack){
    (async()=>{
        var browser = await puppeteer.launch({});
        var page = await browser.newPage();
        await page.goto(url);
        var data = await page.evaluate(()=>document.body.innerHTML);
        await browser.close();
        if(callBack){
            callBack(data);
        }
       
    })()
}
module.exports = puppeteerGet;
    