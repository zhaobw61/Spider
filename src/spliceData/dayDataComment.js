// 统计评论
var locationJson  =require('../bronData/location');
// 连接数据库
var dataBase = require('../../mongodb/index');
// 评论集合
var allComment = new dataBase('zhangAllComment');
// 每天的数据
var dayData = new dataBase('zhangDayData');

allComment.connectDB(function(){
    dayData.connectDB(function(){
        index();
    })
});
var commentSignId = 0;
var allBata = {};
var commentMax = 583;// 手
var loaction = '福建'//手
var joinLocaltion = {} 
function index(){
    allComment.find('single',{commentSignId:commentSignId},function(item){
        console.log(commentSignId);
        if(commentSignId<commentMax){
            if(item.comment!== null){
                for(var i=0;i<item.comment.length;i++){
                    var timeOfDay = item.comment[i].time.split(' ')[0];
                    var twoName = item.comment[i].area.split('').slice(0,2).join("");
                    var threeName = item.comment[i].area.split('').slice(0,4).join("");

                    if(!allBata[timeOfDay]){
                        allBata[timeOfDay] = {
                            comment:0,
                            newsLocationPerson:0,
                            time:item.comment[i].time,
                            timeOfDay:timeOfDay,
                            newsLocation:"",
                            joinLocaltion:{},
                            agree:0
                        }
                    }
                    allBata[timeOfDay].comment++;
                    allBata[timeOfDay].agree += parseInt(item.comment[i].agree);
                    // 统计事发地参与的人数
                    if(twoName === loaction || threeName === loaction){
                        allBata[timeOfDay].newsLocationPerson++;
                        allBata[timeOfDay].newsLocation = loaction;
                    }
                    // 统计参与的地区
                    if(locationJson[twoName]){
                        allBata[timeOfDay].joinLocaltion[twoName] = 1
                    }
                    if(locationJson[threeName]){
                        allBata[timeOfDay].joinLocaltion[threeName] = 1
                    }
                }
                commentSignId ++;
                index();
            }else{
                commentSignId ++;
                index();
            }
        }else{
            var tempArr = [];
            for(var key in allBata){
                var loSign = 0;
                for(var lo in allBata[key].joinLocaltion){
                    loSign ++;
                }
                allBata[key].joinLocalNum = loSign
                tempArr.push(allBata[key]);
            }  
            dayData.insertMany(tempArr,function(){
                allComment.closeDB();
                dayData.closeDB();
                console.log('评论over');
            })
        }
    }) 
}