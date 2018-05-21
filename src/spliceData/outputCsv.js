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
        "time",
        "comment",
        "newsLocationPerson",
        "mediaNum",
        "newsNum",
        "joinLocalNum",
        'agree',
        'totalHot',
        'h1',
        'h2',
        'h3'
    ]
]
function broncsvFile(){
    dayData.find('array',{},function(data){
        arr = data;
        arr.sort(sortTime)
        for(var i=0;i<arr.length;i++){
            var comment = arr[i].comment ? arr[i].comment:0;
            var newsLocationPerson = arr[i].newsLocationPerson ? arr[i].newsLocationPerson:0;
            var mediaNum = arr[i].mediaNum ? arr[i].mediaNum:0;
            var newsNum = arr[i].newsNum ? arr[i].newsNum:0;
            var joinLocalNum =  arr[i].joinLocalNum ? arr[i].joinLocalNum:0;
            var agree = arr[i].agree ? arr[i].agree:0;
            var totalHot = 0.11671041*comment+0.1481959*agree+0.0275217*newsNum+0.2490783*mediaNum+0.10707905*newsLocationPerson+0.02142095*joinLocalNum;
            // var  h1＝权重×新闻报道数＋权重×新闻媒体数＋权重×杭州评论数＋权重×地区个数;
            var  h1=0.0275217*newsNum+0.2490783*mediaNum+0.10707905*newsLocationPerson+0.02142095*joinLocalNum;

            // var  h2＝权重×评论数＋权重×点赞数数＋权重×杭州评论数＋权重×地区个数;
            var  h2=0.11671041*comment+0.1481959*agree+0.10707905*newsLocationPerson+0.02142095*joinLocalNum;

            // var h3＝权重×评论数＋权重×点赞数数＋权重×新闻报道数＋权重×新闻媒体数
            var h3=0.11671041*comment+0.1481959*agree+0.0275217*newsNum+0.2490783*mediaNum;

            scvArr.push([
                arr[i].timeOfDay,
                comment,
                newsLocationPerson,
                mediaNum,
                newsNum,
                joinLocalNum,
                agree,
                totalHot,
                h1,
                h2,
                h3
            ])
        }
        saveJSonToCSV(scvArr);
    })
}
function saveJSonToCSV(data,callback){
    stringify(data, function(err, output,callback) {
        fs.appendFile('everydata.csv', output, 'utf8',function(callback){
            console.log('save-csv-OK!!');
            dayData.closeDB();
        });
    });
}
function sortTime(a,b){
    return  new Date(a.timeOfDay) - new Date(b.timeOfDay);
  }