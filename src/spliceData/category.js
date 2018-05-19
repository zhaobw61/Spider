// 连接数据库
var dataBase = require('../../mongodb/index');
// 每天的数据
var baomu = new dataBase('baomuDayData');
var zhang = new dataBase('zhangDayData');
var li = new dataBase('liDayData')
// 保存文件
var saveData = require('../saveData');

baomu.connectDB(function(){
    // baomuIndex('comment');
    baomuIndex('hot');
})
zhang.connectDB(function(){
    // zhangIndex('comment');
    zhangIndex('hot');
})
li.connectDB(function(){
    // LiIndex('comment');
    LiIndex('hot');
})
var time;
var arr;
var newArr = [];

function LiIndex(type){
    li.find('array',{},function(data){
        arr = data;
        arr.sort(sortTime)
        console.log(arr);
        var obj = {};
        obj.time = [];
        obj.date = [];
        for(var i=0;i<arr.length;i++){
            obj.time.push(arr[i].timeOfDay);
            var comment = arr[i].comment ? arr[i].comment : 0;
            var agree = arr[i].agree ? arr[i].agree : 0;
            var newsNum = arr[i].newsNum ? arr[i].newsNum : 0;
            var mediaNum = arr[i].mediaNum ? arr[i].mediaNum : 0;
            var newsLocationPerson = arr[i].newsLocationPerson ? arr[i].newsLocationPerson : 0;
            var joinLocalNum = arr[i].joinLocalNum ? arr[i].joinLocalNum : 0;
            var hot = H=0.1622277*comment+0.0540702*agree+0.10832448*newsNum+0.43915506*mediaNum+0.08766564*newsLocationPerson+0.01753134*joinLocalNum
            // if(comment>1000)
            // comment = comment/100;
            obj.date.push(hot);
        }
        saveData('/echartData/li'+type+'.json',obj,function(){
            console.log('ok');
        })
    })
}

function zhangIndex(type){
    zhang.find('array',{},function(data){
        arr = data;
        arr.sort(sortTime)
        console.log(arr);
        var obj = {};
        obj.time = [];
        obj.date = [];
        for(var i=0;i<arr.length;i++){
            obj.time.push(arr[i].timeOfDay);
            var comment = arr[i].comment ? arr[i].comment : 0;
            var agree = arr[i].agree ? arr[i].agree : 0;
            var newsNum = arr[i].newsNum ? arr[i].newsNum : 0;
            var mediaNum = arr[i].mediaNum ? arr[i].mediaNum : 0;
            var newsLocationPerson = arr[i].newsLocationPerson ? arr[i].newsLocationPerson : 0;
            var joinLocalNum = arr[i].joinLocalNum ? arr[i].joinLocalNum : 0;
            var hot = H=0.1622277*comment+0.0540702*agree+0.10832448*newsNum+0.43915506*mediaNum+0.08766564*newsLocationPerson+0.01753134*joinLocalNum
            // if(comment>1000)
            // comment = comment/100;
            obj.date.push(hot);
        }
        saveData('/echartData/zhang'+type+'.json',obj,function(){
            console.log('ok');
        })
    })
}
function baomuIndex(type){
    baomu.find('array',{},function(data){
        arr = data;
        arr.sort(sortTime)
        console.log(arr);
        var obj = {};
        obj.time = [];
        obj.date = [];
        for(var i=0;i<arr.length;i++){
            obj.time.push(arr[i].timeOfDay);
            var comment = arr[i].comment ? arr[i].comment : 0;
            var agree = arr[i].agree ? arr[i].agree : 0;
            var newsNum = arr[i].newsNum ? arr[i].newsNum : 0;
            var mediaNum = arr[i].mediaNum ? arr[i].mediaNum : 0;
            var newsLocationPerson = arr[i].newsLocationPerson ? arr[i].newsLocationPerson : 0;
            var joinLocalNum = arr[i].joinLocalNum ? arr[i].joinLocalNum : 0;
            var hot = H=0.1622277*comment+0.0540702*agree+0.10832448*newsNum+0.43915506*mediaNum+0.08766564*newsLocationPerson+0.01753134*joinLocalNum
            // if(comment>1000)
            // comment = comment/100;
            obj.date.push(hot);
        }
        saveData('/echartData/baomu'+type+'.json',obj,function(){
            console.log('ok');
        })
    })
}
function sortTime(a,b){
  return  new Date(a.timeOfDay) - new Date(b.timeOfDay);
}