var readFile = require('./readFile');
var puppeteerGet = require('./puppeteerGet');
var httpGet = require('./httpGet');
var url = require("url");
var splitComomsUrl =require('./splitComomsUrl');
var saveData = require('./saveData');
var collectSearchData = require('./collectSearchData');
var collectContentAndComs = require('./collectContentAndComs');
// 新闻名称
// var newName = '杭州保姆纵火案';
var newName = '南海问题';
// 收索范围：all新闻全文 title新闻标题
var range = 'all';
// 收索类型
var c = 'news';
// 排序方法
var sort = 'time';
// 当前页
var page = 1;
// 页码最大数
var pageNumMax = 1;
var url = 'http://search.sina.com.cn/?q='+newName+'&range='+range+'&c='+c+'&sort='+sort+'&ie=utf-8'+'&page='+page;
//http://search.sina.com.cn/?q=杭州保姆纵火案&range=all&c=news&sort=time&ie=utf-8
//http://search.sina.com.cn/?q=杭州保姆纵火案&range=all&c=news&sort=time&ie=utf-8&page=2&pf=2131294380&ps=2134309112&dpc=1
console.log(url);
function collectNewsUrl(page,resolve,reject){
    url = 'http://search.sina.com.cn/?q='+newName+'&range='+range+'&c='+c+'&sort='+sort+'&ie=utf-8'+'&page='+page;
    //http://search.sina.com.cn/?q=南海问题&range=all&c=news&sort=time
    //http://search.sina.com.cn/?q=南海问题&range=all&c=news&sort=time&ie=utf-8&page=1
    puppeteerGet(url,'/dataBase/inputSearchPage/inputSearch.html',function(data){
        console.log('开始收集第'+page);
        saveData('/dataBase/inputSearchPage/inputSearch.html',data,function(){
            // 整理收索框的数据
            var tempUrlArr = collectSearchData('/dataBase/inputSearchPage/inputSearch.html');
            if(tempUrlArr.maxPage>pageNumMax){
                pageNumMax = tempUrlArr.maxPage;
            }
            console.log('pageNumMax',pageNumMax);
            console.log('maxPage',tempUrlArr.maxPage);
            if(tempUrlArr.maxPage == 0){
                collectNewsUrl(page,resolve,reject);
            }else{
                saveData('/dataBase/inputSearchPage/inputSearchData'+page+'.js',tempUrlArr.data,function(){
                    // resolve();
                    console.log('收集page'+page+'已完成');
                    if(page<pageNumMax){
                        page ++;
                        collectNewsUrl(page,resolve,reject);    
                    }else{
                        resolve();
                    }
                })
            }
        });
    });
}
// 请求收索框的页面的数据
var saveSearchNews = new Promise(function(resolve,reject){
    collectNewsUrl(1,resolve,reject);
    // resolve();
});

var newUrlId = 0;
var isNewPage = true;
var pageId = 1;
var tempArr = [];
// 收集每个新闻的内容和评论
function collectNewsAndComments(){
    console.log('开始保存第'+pageId+'页第'+newUrlId+'条新闻内容');
    var newId = 0;
    if(isNewPage){
        tempArr = JSON.parse(readFile('/dataBase/inputSearchPage/inputSearchData'+pageId+'.js'));
        isNewPage = false;
    }
    // 请求新闻详情页
    httpGet(tempArr[newUrlId].newUrl,function(data){
        var tempData = collectContentAndComs(data);
        tempData.newsUrl = tempArr[newUrlId].newUrl;
        // 请求评论
        httpGet(tempData.commentsUrl,function(data){
            eval(data);
            tempData.commentData = data;
            saveData('/dataBase/newsDetialAndComments/detAndCom'+pageId+'-'+newUrlId+'.js',tempData,function(){
                newUrlId++;
                // 新的一页
                if(newUrlId>=tempArr.length){
                    // 翻页
                    pageId ++;
                    if(pageId <= pageNumMax){
                        console.log('newpage!!!');
                        newUrlId = 0;
                        isNewPage = true;
                    }else{
                        console.log('收集完所有的新闻内容和评论');
                        console.log('^_^! 收集完啦 早点休息');
                        return false;
                    }
                    
                }
                collectNewsAndComments();
            });
        });
    });
}
saveSearchNews.then(function(){
    collectNewsAndComments();
    
})
