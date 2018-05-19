// 连接数据库
var dataBase = require('../../mongodb/index');
// 每天的数据
var dayData = new dataBase('baomuDayData');
// 保存文件
var saveData = require('../saveData');
// 保存文件
var fs = require('fs');
var stringify = require('csv-stringify');

dayData.connectDB(function(){
    broncsvFile();
})
var scvArr = [
    [
        "comment",
        "newsLocationPerson",
        "mediaNum",
        "newsNum",
        "joinLocalNum",
        'agree',
        'hot'
    ]
]
function broncsvFile(){
    dayData.find('array',{},function(data){
        arr = data;
        for(var i=0;i<arr.length;i++){
            scvArr.push([
                arr[i].comment ? arr[i].comment:0,
                arr[i].newsLocationPerson ? arr[i].newsLocationPerson:0,
                arr[i].mediaNum ? arr[i].mediaNum:0,
                arr[i].newsNum ? arr[i].newsNum:0,
                arr[i].joinLocalNum ? arr[i].joinLocalNum:0,
                arr[i].agree ? arr[i].agree:0,
                arr[i].comment ? arr[i].comment:0
            ])
        }
        saveJSonToCSV(scvArr);
    })
}
function saveJSonToCSV(data,callback){
    stringify(data, function(err, output,callback) {
        fs.appendFile('data.csv', output, 'utf8',function(callback){
            console.log('save-csv-OK!!');
            dayData.closeDB();
        });
    });
}