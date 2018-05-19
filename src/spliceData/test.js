// 连接数据库
var dataBase = require('../../mongodb/index');
// 每天的数据
var dayData = new dataBase('baomuDayData');
// 连接数据库
var baomuAllComment = new dataBase('baomuAllComment');
// 保存文件
var saveData = require('../saveData');
// 保存文件
var fs = require('fs');
baomuAllComment.connectDB(function(){
    broncsvFile();
})
function broncsvFile(){
    baomuAllComment.find('array',{commentSignId:3},function(data){
        console.log(data.length);
        saveData('/asd.json',data,function(){
            console.log('ok');
            baomuAllComment.closeDB();
        })
    })
}
