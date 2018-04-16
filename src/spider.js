var readFile = require('./readFile');
var puppeteerGet = require('./puppeteerGet');
var httpGet = require('./httpGet');
var url = require("url");

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
    // 请求收索框的页面的数据
    var saveSearchNews = new Promise(function(resolve,reject){
        // puppeteerGet(url,'/dataBase/inputSearchPage/inputSearch.html',function(){
        //     console.log('save inputPage data success!');
        //     resolve();
        // });
        resolve();
    });
    // 请求新闻详情页
    var saveNewsDetial = saveSearchNews.then(function(){
        var tempPro = new Promise(function(resolve,reject){
            var tempArr =JSON.parse(readFile('/dataBase/inputSearchPage/inputSearchData.js'));
            for(var i=0;i<tempArr.length;i++){
                httpGet(tempArr[i].newUrl,'/dataBase/newsDetialPage/'+i+'.html');
            }
        })
        return tempPro;
    })
})()
