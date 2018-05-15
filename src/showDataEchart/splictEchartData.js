// 连接数据库
var dataBase = require('../../mongodb/index');
// 保存文件
var saveData = require('../saveData');
// 连接数据库
var dbObj = new dataBase('news');

dbObj.connectDB(function(){
    newsDatabarGraph()
})
var newsSign = 0;
var newSum = 406;
var eChartObj = {};
var minYear = 2199;
var maxYear = 0;
// 柱状图 每天的新闻数
function newsDatabarGraph(){
    dbObj.find('single',{'newsSign':newsSign},function(dbObjitem){
        var newsTime = dbObjitem.fgray_time.split(" ").slice('1').join(" ");
        var myDate = new Date(newsTime);
        var mon = myDate.getMonth()+1;
        var year = myDate.getFullYear();
        var monName = year+'-'+mon;
        if(year<minYear) minYear = year;
        if(year>maxYear) maxYear = year;
        if(eChartObj[monName]){
            eChartObj[monName] ++;
        }else{
            eChartObj[monName] = 1;
        }
        newsSign++
        if(newsSign<newSum){
            newsDatabarGraph();
        }else{
            console.log(minYear,maxYear);
            var temp = {xAxis:[],series:[]};
            for(var i=minYear;i<=maxYear;i++){
                for(var monIn = 1;monIn<=12;monIn++){
                    var indexYM = i+'-'+monIn;
                    if(eChartObj[indexYM]){
                        temp.xAxis.push(indexYM);
                        temp.series.push(eChartObj[indexYM]);
                    }
                }
            }            
            saveData('/dataBase/Bardata.json',temp,function(){
                console.log('保存完成');
                dbObj.closeDB();
            })
        }
    });
}
