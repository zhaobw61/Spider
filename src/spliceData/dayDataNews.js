// 连接数据库
var dataBase = require('../../mongodb/index');
// 新闻内容
var newOfContent = new dataBase('zhangOfContent');
// 每天的数据
var dayData = new dataBase('zhangDayData');

newOfContent.connectDB(function(){
    dayData.connectDB(function(){
        index();
    })
})
var newsSign = 0;
var allBata = {};
var allDataArr = [];
var allNewsNum = 108;//手
function index(){
    if(newsSign<allNewsNum){
        console.log('解析');
        newOfContent.find('single',{newsSign:newsSign},function(item){
            console.log(item.fgray_time);
            var fgray_time = item.fgray_time;
            var fgray_timeArr = fgray_time.split(" ");
            var mediaName = fgray_timeArr[0];
            var newTime = fgray_timeArr[1];
            console.log(fgray_timeArr);
            console.log(newTime);
            if(!allBata[newTime]){
                allBata[newTime] = {}
                allBata[newTime]['newTime'] = newTime;
                allBata[newTime]['newsNum'] = 0;
                allBata[newTime]['mediaArr'] = {};
            }
            allBata[newTime]['newsNum'] ++;
            if(!allBata[newTime]['mediaArr'][mediaName]){
                allBata[newTime]['mediaArr'][mediaName] = 1;
            }
            newsSign++;
            console.log(newsSign);
            index();
        })
    }else{
        for(var key in allBata){
            var temp = 0;
            for(keyy in allBata[key].mediaArr){
                temp++;
            }
            console.log(allBata[key]);
            allBata[key].mediaNum = temp;
            allDataArr.push(allBata[key]);
        }
        updataOne()
    }
}
var allBataArrSign = 0
function updataOne(){
    console.log('开始插入',allBataArrSign);
    console.log(allDataArr[allBataArrSign]);
    console.log({"timeOfDay":allDataArr[allBataArrSign].newTime});
    dayData.updateOne({"timeOfDay":allDataArr[allBataArrSign].newTime},{$set:allDataArr[allBataArrSign]},function(){
        console.log('更新成功',allBataArrSign);
        allBataArrSign++;
        if(allBataArrSign<allDataArr.length){
            updataOne();
        }else{
            dayData.closeDB();
            newOfContent.closeDB();
            console.log('完成');
        }
    });
}
// {
//  "_id" : ObjectId("5afed775980f3a1e65868c40"), 
// "comment" : 231, //评论数
// "newsLocationPerson" : 17, //新闻事发地参与人数
// "time" : "2018-05-18 18:31:12", //评论时间
// "timeOfDay" : "2018-05-18", //截取评论的时间
// "newsLocation" : "浙江", //新闻发生地
// "joinLocaltion" : { "浙江" : 1, "广东" : 1, "北京" : 1, "天津" : 1, "四川" : 1, "吉林" : 1, "福建" : 1, "上海" : 1, "青海" : 1, "山东" : 1, "湖北" : 1, "河南" : 1, "重庆" : 1, "湖南" : 1, "江苏" : 1, "陕西" : 1, "广西" : 1, "河北" : 1, "云南" : 1, "山西" : 1, "安徽" : 1, "甘肃" : 1, "江西" : 1, "辽宁" : 1, "海南" : 1, "贵州" : 1 },
// "joinLocalNum" : 26, 
// //参与评论的地区
// "mediaArr" : { "新京报" : 1, "中国青年报" : 1, "央广网" : 1 }, 
// "mediaNum" : 3, //当天报道的媒体数量
// "newTime" : "2018-05-18", //新闻事件
// "newsNum" : 3 //新闻数量
// }
