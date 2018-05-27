var readFile = require('./readFile');
var puppeteerGet = require('./puppeteerGet');
var httpGet = require('./httpGet');
var url = require("url");
var saveData = require('./saveData');
var collectSearchData = require('./collectSearchData');
var collectContentAndComs = require('./collectContentAndComs');
var newsSign = 0;
// 连接数据库
var dataBase = require('../mongodb/index');
// 新闻名称
var newName = '特朗普上台';
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
var saveSearchNews;
var totleNewsNum = 0
// 新闻内容
var dbObj = new dataBase('telangpuOfContent');
// 评论集合
var dbObjOfcomment = new dataBase('telangpuAllComment');
// 请求收索框的页面的数据
function collectNewsUrl(page,resolve,reject){
    url = 'http://search.sina.com.cn/?q='+newName+'&range='+range+'&c='+c+'&sort='+sort+'&ie=utf-8'+'&page='+page;
    puppeteerGet(url,function(data){
        console.log('开始收集第'+page);
        saveData('/dataBase/inputSearchPage/inputSearch.html',data,function(){
            // 整理收索框的数据
            var tempUrlArr = collectSearchData('/dataBase/inputSearchPage/inputSearch.html',totleNewsNum);
            if(tempUrlArr.maxPage>pageNumMax){
                pageNumMax = tempUrlArr.maxPage;
            }
            // newsSign = tempUrlArr.newsSign;
            console.log('pageNumMax',pageNumMax);
            if(tempUrlArr.maxPage == 0){
                collectNewsUrl(page,resolve,reject);
            }else{
                urlArrSign = 0;
                insertOneUrl(tempUrlArr.data,function(){
                    console.log('收集page'+page+'已完成');
                    if(page<pageNumMax){
                        page ++;
                        collectNewsUrl(page,resolve,reject);    
                    }else{
                        resolve();
                    }    
                });
            }
        });
    });
}
var urlArrSign = 0;
function insertOneUrl(urlArr,callBack){
    dbObj.find('array',{newUrl:urlArr[urlArrSign].newUrl},function(arr){
        if(arr.length === 0){
            urlArr[urlArrSign].newsSign = totleNewsNum;
            console.log('newsSign',urlArr[urlArrSign].newsSign);
            dbObj.insertOne(urlArr[urlArrSign],function(){
                urlArrSign++;
                totleNewsNum++;
                if(urlArrSign<urlArr.length){
                    insertOneUrl(urlArr,callBack);
                }else{
                    if(callBack) callBack();
                }
            });
        }else{
            console.log('出现重复的新闻:'+urlArr[urlArrSign].newName);
            urlArrSign++;
            if(urlArrSign<urlArr.length){
                insertOneUrl(urlArr,callBack);
            }else{
                if(callBack) callBack();
            }
        }
    });
    
}
var alreadNum = 0;
function collectNewsAndComments(resolve,reject){
    var res = dbObj.find('single',{'newsSign':alreadNum},function(res){
        // 请求新闻详情页
        httpGet(res.newUrl,function(data){
            var tempData = collectContentAndComs(data);
            // 请求评论
            console.log('准备收集评论第',alreadNum);
            httpGet(tempData.commentsUrl,function(data){
                eval(data);
                tempData.commentData = data;
                dbObj.updateOne({'newsSign':res.newsSign},{$set:tempData},function(){
                    console.log('完成收集评论:'+res.newName);
                    alreadNum ++;
                    if(alreadNum<totleNewsNum){
                        collectNewsAndComments(resolve,reject);
                    }
                    else{
                        // 进入整理评论和获取更多评论
                        console.log('进入整理评论和获取更多评论');
                        resolve();
                    }
                });
            })
        })
    });
}
var colAlreadNum = 0;
// 评论请求次数
var commentsGetSum = 0;
// 当前评论
var currentPageNum = 1;

var allComment = [];
// 收集更多的评论
function collectionMoreComment(){
    allComment = [];
    currentPageNum = 1;
    var res = dbObj.find('single',{'newsSign':colAlreadNum},function(res){
        var data = res;
        var commentNum = 0;
        if(data.commentData.result.status.code == 0){
            // 评论数
            commentNum = data.commentData.result.count.show;    
        }
        var commentsUrl = data.commentsUrl;
        if(commentNum){
            commentsGetSum = Math.ceil(commentNum/20);
            getComment(data,function(){
                console.log('第'+colAlreadNum+'条新闻收集完所有的评论 - '+'新闻总数'+totleNewsNum);
                colAlreadNum++;
                if(colAlreadNum<totleNewsNum){
                    collectionMoreComment();
                }else{
                    console.log('更新完所有数据');
                    dbObj.closeDB();
                    dbObjOfcomment.closeDB();
                }
            });
        }else{
            console.log('第'+colAlreadNum+'没有评论');
            colAlreadNum++;
            if(colAlreadNum<totleNewsNum){
                collectionMoreComment();
            }else{
                console.log('更新完所有数据');
                dbObj.closeDB();
                dbObjOfcomment.closeDB();
            }
        }
    })
}
var commentSignId = 0
// 请求评论
function getComment(urlData,callBack){    
    var commentsArrUrl = 'http://comment5.news.sina.com.cn/page/info?version=1&format=js&channel='+urlData['channel']+'&newsid='+urlData['newsid']+'&group=&compress=0&ie=gbk&oe=gbk&page='+currentPageNum+'&page_size=20';
    console.log('----在请求第'+colAlreadNum+'条-'+'新闻总数'+totleNewsNum+'-第'+currentPageNum+'部分'+'部分总数'+commentsGetSum);
    httpGet(commentsArrUrl,function(data){
        eval(data);
        var tempObj = {newsId:urlData['newsid']+'-'+currentPageNum,comment:data.result.cmntlist};
        tempObj.commentSignId = commentSignId;
        console.log({newsId:urlData['newsid']+'-'+currentPageNum});
        dbObjOfcomment.insertOne(tempObj,function(){
            commentSignId++;
            console.log('保存'+currentPageNum+'部分成功');
            currentPageNum ++;
            if(currentPageNum<=commentsGetSum){
                getComment(urlData,callBack);
            }else{
                if(callBack) callBack();
            }
        })
    })
}
dbObjOfcomment.connectDB(function(){
    dbObj.connectDB(function(){
        saveSearchNews = new Promise(function(resolve,reject){
            collectNewsUrl(1,resolve,reject);  
            // resolve();
        });
        var collectionComment = new Promise(function(resolve,reject){
            saveSearchNews.then(function(){
                console.log('收集的新闻数'+totleNewsNum);
                collectNewsAndComments(resolve,reject);
            })
            // resolve();
        });
        collectionComment.then(function(){
            console.log('开始评论的二次收集');
            collectionMoreComment();
        });
    });
});
