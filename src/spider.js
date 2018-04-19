var readFile = require('./readFile');
var puppeteerGet = require('./puppeteerGet');
var httpGet = require('./httpGet');
var url = require("url");
var splitComomsUrl =require('./splitComomsUrl');
var saveData = require('./saveData');
var collectSearchData = require('./collectSearchData');
// 新闻名称
var newName = '杭州保姆纵火案';
// 收索范围：all新闻全文 title新闻标题
var range = 'all';
// 收索类型
var c = 'news';
// 排序方法
var sort = 'time';
// 当前页
var page = 1;
var url = 'http://search.sina.com.cn/?q='+newName+'&range='+range+'&c='+c+'&sort='+sort+'&ie=utf-8'+'&page='+page;
//http://search.sina.com.cn/?q=杭州保姆纵火案&range=all&c=news&sort=time&ie=utf-8
//http://search.sina.com.cn/?q=杭州保姆纵火案&range=all&c=news&sort=time&ie=utf-8&page=2&pf=2131294380&ps=2134309112&dpc=1
console.log(url);
function collectNewsUrl(page){
    url = 'http://search.sina.com.cn/?q='+newName+'&range='+range+'&c='+c+'&sort='+sort+'&ie=utf-8'+'&page='+page;
    puppeteerGet(url,'/dataBase/inputSearchPage/inputSearch.html',function(data){
        saveData('/dataBase/inputSearchPage/inputSearch.html',data,function(){
            // 整理收索框的数据
            var tempUrlArr = collectSearchData('/dataBase/inputSearchPage/inputSearch.html');
            saveData('/dataBase/inputSearchPage/inputSearchData'+page+'.js',tempUrlArr,function(){
                // resolve();
                console.log('page'+page+'已完成');
                page ++;
                if(page<3){
                    collectNewsUrl(page);    
                }
                console.log(page);
            })
        });
    });
}
// 请求收索框的页面的数据
var saveSearchNews = new Promise(function(resolve,reject){
    collectNewsUrl(1);
});
// 请求新闻详情页 拼接处评论url
var saveNewsDetial = saveSearchNews.then(function(){
    var obj = [];
    var tempPro = new Promise(function(resolve,reject){
        var tempQQ = readFile('/dataBase/inputSearchPage/inputSearchData.js');
        var tempArr =JSON.parse(tempQQ);
        for(var i=0;i<tempArr.length;i++){
            httpGet(tempArr[i].newUrl,'/dataBase/newsDetialPage/'+i+'.html',function(data){
                var url = splitComomsUrl(data);
                obj.push({"commentsUrl":url});
                if(obj.length == tempArr.length){
                    saveData('/dataBase/commentsUrl/commentsUrl.js',obj,function(){
                        console.log('保存评论链接完成');
                        resolve();
                    });
                }
            });
        }
    })
    return tempPro;
})
saveNewsDetial.then(function(){
    console.log('start save comments Data');
    var obj = [];
    var tempPro = new Promise(function(resolve,reject){
        var tempArr =JSON.parse(readFile('/dataBase/commentsUrl/commentsUrl.js'));
        for(var i=0;i<tempArr.length;i++){
            httpGet(tempArr[i].commentsUrl,'/dataBase/newsDetialPage/'+i+'.html',function(data){
                eval(data);
                obj.push({"commentsData":data});
                if(obj.length == tempArr.length){
                    saveData('/dataBase/commentsData/commentsData.js',obj,function(){
                        console.log('保存评论内容完成');
                    });
                    resolve(obj);
                }
            });
        }
    })
    return tempPro;
});
