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
// 当前页最大数
var pageNumMax = 3;
var url = 'http://search.sina.com.cn/?q='+newName+'&range='+range+'&c='+c+'&sort='+sort+'&ie=utf-8'+'&page='+page;
//http://search.sina.com.cn/?q=杭州保姆纵火案&range=all&c=news&sort=time&ie=utf-8
//http://search.sina.com.cn/?q=杭州保姆纵火案&range=all&c=news&sort=time&ie=utf-8&page=2&pf=2131294380&ps=2134309112&dpc=1
console.log(url);
function collectNewsUrl(page,resolve,reject){
    url = 'http://search.sina.com.cn/?q='+newName+'&range='+range+'&c='+c+'&sort='+sort+'&ie=utf-8'+'&page='+page;
    puppeteerGet(url,'/dataBase/inputSearchPage/inputSearch.html',function(data){
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
// 收集评论链接
function collectCommentsUrl(page,resolve,reject){
    var obj = [];
    var tempArr =JSON.parse(readFile('/dataBase/inputSearchPage/inputSearchData'+page+'.js'));
    console.log('开始保存第'+page+'页');
    for(var i=0;i<tempArr.length;i++){
        // console.log(tempArr[i].newUrl);
        httpGet(tempArr[i].newUrl,function(data){
            var url = splitComomsUrl(data);
            obj.push({"commentsUrl":url});
            if(obj.length == tempArr.length){
                saveData('/dataBase/commentsUrl/commentsUrl'+page+'.js',obj,function(){
                    console.log('保存第'+page+'页评论链接完成');
                    if(page<pageNumMax){
                        page++;
                        collectCommentsUrl(page,resolve,reject);    
                    }else{
                        resolve();
                    }  
                });
            }
        });
    }
}
// 请求新闻详情页 拼接处评论url
var saveNewsDetial = saveSearchNews.then(function(){
    console.log('开始请求新闻详情页,拼接处评论url');
    page = 1;
    var tempPro = new Promise(function(resolve,reject){
        collectCommentsUrl(page,resolve,reject);         
        // resolve();
    })
    return tempPro;
})
// 收集评论内容
function collectCommentsContent(page,resolve,reject){
    var obj = [];
    var tempArr =JSON.parse(readFile('/dataBase/commentsUrl/commentsUrl'+page+'.js'));
    for(var i=0;i<tempArr.length;i++){
        httpGet(tempArr[i].commentsUrl,function(data){
            eval(data);
            obj.push({"commentsData":data});
            if(obj.length == tempArr.length){
                saveData('/dataBase/commentsData/commentsData'+page+'.js',obj,function(){
                    console.log('保存第'+page+'页评论内容完成');
                    if(page<pageNumMax){
                        page++;
                        collectCommentsContent(page,resolve,reject);   
                    }else{
                        resolve();
                    } 
                });
            }
        });
    }
}
saveNewsDetial.then(function(){
    console.log('开始保存评论');
    page = 1;
    console.log(pageNumMax);
    var tempPro = new Promise(function(resolve,reject){
        collectCommentsContent(page,resolve,reject);
    })
    return tempPro;
});
