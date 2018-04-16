var puppeteer = require('puppeteer');
var saveData = require('./saveData');
var collectSearchData = require('./collectSearchData');
//用于请求html
function puppeteerGet(url,fileName,callBack){
    (async()=>{
        var browser = await puppeteer.launch({});
        var page = await browser.newPage();
        await page.goto(url);
        var data = await page.evaluate(()=>document.body.innerHTML);
        await browser.close();
        console.log('popo');
        // console.log(fileName,data);
        saveData(fileName,data,function(){
            // 整理收索框的数据
            collectSearchData('/dataBase/inputSearchPage/inputSearch.html','/dataBase/inputSearchPage/inputSearchData.js');
            if(callBack){
                callBack();
            }
        });
    })()
}
module.exports = puppeteerGet;
    