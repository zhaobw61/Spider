// 连接数据库
var dataBase = require('../../mongodb/index');
// 每天的数据
var dayData = new dataBase('baomuDayData');
// 保存文件
var saveData = require('../saveData');

dayData.connectDB(function(){
    index();
})
var time;
var arr;
var newArr = [];
function index(){
    dayData.find('array',{},function(data){
        arr = data;
        arr.sort(sortTime);
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
            var hot = H=0.1622277*comment+0.0540702*agree+0.10832448*newsNum+0.97521468*mediaNum+0.08766564*newsLocationPerson+0.01753134*joinLocalNum
            var actualHot = agree + comment;
            obj.date.push(actualHot);
        }
        saveData('/echartData/baomuactualHot.json',obj,function(){
            console.log('ok');
            dayData.closeDB();
        })
    })
}
function sortTime(a,b){
  return  new Date(a.timeOfDay) - new Date(b.timeOfDay);
}