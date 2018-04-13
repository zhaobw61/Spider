var axios = require('axios');
var cheerio = require('cheerio');
var fs = require("fs");
(async()=>{
  
    // await page.goto('https://www.bilibili.com/ranking');
    var url = 'https://www.bilibili.com/ranking';
    var pro = axios.post(url);
    pro.then(function(res){
        fs.writeFile('index1.html',res.data,function(){
            console.log('create file ok');
        })    
    });
    pro.catch(function(){
        console.log('error')
    })
    
    console.log(1);
    // var $ = cheerio.load(html);

    // var rankList = $('.rank-list');
    // var rt = rankList.find('.title')
    // var con = "";
    // for(var i=0;i<rt.length;i++){
    //     con += $(rt[i]).text();
    //     con += '\r';
    // }
    // console.log(2);
    // fs.writeFile('rt.md',con,function(){
    //     console.log('con--ok');
    // })

    // console.log(rt);

})()