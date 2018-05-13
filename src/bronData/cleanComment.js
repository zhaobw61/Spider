// 整理数据 生成csv
var locationJson  =require('./location');
// 连接数据库
var dataBase = require('../../mongodb/index');
// 保存文件
var saveData = require('../saveData');
// 连接数据库
var allComments = new dataBase('allComments');

var dbObj = new dataBase('news');
var stringify = require('csv-stringify');

var fileTitle = ['newsList','total','replay','time','newsTiem'];
// replydict 回复评论的关系
// cmntlist 最新评论
// hot_list 最热评论
dbObj.connectDB(function(){
    allComments.connectDB(function(){
        // broncsvFile();
        testallComments();
        // testdbObj();
    });    
});
function testallComments(){
    allComments.find('single',{"commentSignId": 2906},function(item,index,ll){
        console.log(item,index,ll);
        saveData('/testallComments.json',item,function(){
            console.log('保存完成');
            allComments.closeDB();
            dbObj.closeDB();
        })
    })
}
function testdbObj(){
    dbObj.find('array',{"newsid":"comos-fyrvaxf1249665"},function(item){
        saveData('/testdbObj.json',item,function(){
            console.log('保存完成');
            allComments.closeDB();
            dbObj.closeDB();
        })
    })
}
var obj = {};
var commentLocal;
function initcommentLocal(){
    commentLocal = {};
    for(var key in locationJson){
        commentLocal[locationJson[key]] = 0;
    }
}
var commentSignId = 0;
function broncsvFile(){
    allComments.find('single',{commentSignId:commentSignId},function(item,index,arr){
        console.log(item.newsId);
        if(item.newsId){
            if(item.comment){
                obj = {};        
                var itemArr = item.newsId.split('-');
                var newsId = itemArr.slice(0,2).join('-');
                var commentID = itemArr.slice(2,3).join('-');
                // console.log(newsId,commentID);
                var userComment = item.comment;
                dbObj.find('single',{"newsid": newsId},function(dbObjitem,indexDB,arrDB){
                    obj.newsList = dbObjitem.newUrl;
                    var newsTime = dbObjitem.fgray_time.split(" ").slice('1').join(" ");
                    // console.log('newsTime:',newsTime)
                    newsTime = new Date(newsTime.replace(/\-/g, "/"));
        
                    if(dbObjitem.commentData.result.status.code == 0){
                        // 评论数
                        obj.total = dbObjitem.commentData.result.count.total;
                        obj.replay = dbObjitem.commentData.result.count.show;
                        obj.newsTime = newsTime;
                    }else{
                        obj.total = 0;
                        obj.replay = 0;
                        obj.time = 0;
                    }            
                    // console.log(dbObjitem.fgray_time);
                    var csvArr = [];
                    // console.log(userComment.length);
                    for(var i=0;i<userComment.length;i++){
                        initcommentLocal();
                        //新闻时间 newsTime
                        //评论时间
                        obj.time = parseInt(new Date(userComment[i].time) - newsTime)/1000/60;
                        var twoName = userComment[i].area.split('').slice(0,2).join("");
                        var threeName = userComment[i].area.split('').slice(0,4).join("");
                        // console.log(twoName,threeName);
                        if(locationJson[twoName]){
                            commentLocal[locationJson[twoName]] = 1;
                        }
                        if(locationJson[threeName]){
                            commentLocal[locationJson[threeName]] = 1;
                        }
                        for(var key in commentLocal){
                            obj[key] = commentLocal[key];
                        } 
                        // console.log(obj);
                        var tempcsvArr = [];
                        for(var key in obj){
                            tempcsvArr.push(obj[key]);
                        }
                        csvArr.push(tempcsvArr);
                        // console.log(tempcsvArr); 
                    }
                    saveJSonToCSV(csvArr,function(){
                        commentSignId ++;
                        console.log('next');
                        broncsvFile();
                    }); 
                })
            }else{
                commentSignId ++;
                console.log('next');
                broncsvFile();
            }
        }else{
            allComments.closeDB();
            dbObj.closeDB();
            console.log('生成csv文件完成');
        }
    })
}
// function find
function saveJSonToCSV(data,callback){
    stringify(data, function(err, output,callback) {
        fs.appendFile('data.csv', output, 'utf8',function(callback){
            console.log('saveOK!!');
            commentSignId ++;
            console.log('next');
            broncsvFile();
        });
    });
}

var path = require('path');
var fs = require('fs');
var dirPath = path.resolve();
function appendFileSync(fileName,content){
    fs.appendFileSync(dirPath+fileName,content)
}