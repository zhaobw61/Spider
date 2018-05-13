// 把数据保存到数据库
var MongoClient = require('mongodb').MongoClient;
function dataBase(tableName){
    this.model = {};
    this.DBName = 'newsSpider';
    this.url = "mongodb://127.0.0.1:27017/"+this.DBName;
    this.tableName = tableName;
}
// 连接数据库
dataBase.prototype.connectDB = function(callBack){
    var _this = this;
    MongoClient.connect(this.url,function(err,db) {
        if (err) throw err;
        console.log("数据库已连接!");
        _this.model.db = db;
        // 选择数据库
        _this.model.dataBase = db.db(_this.model.DBName);
        // 创建表
        _this.createCollection(callBack);
        // if(callBack) callBack();
    });
}
// 关闭数据库
dataBase.prototype.closeDB = function(){
    this.model.db.close();
    console.log('关闭数据库');
}
// 创建table
dataBase.prototype.createCollection = function(callBack){
    var dbase =  this.model.dataBase;
    var _this = this;
    dbase.createCollection( _this.tableName, function (err, res) {
        if (err) throw err;
        console.log(_this.tableName + "创建集合!");
        if(callBack) callBack();
    });
}
// 插入一条数据
dataBase.prototype.insertOne = function(data,callBack){
    var dbase =  this.model.dataBase;
    var _this = this;
    dbase.collection(this.tableName).insertOne(data, function(err, res) {
        if (err) throw err;
        console.log("文档插入成功");
        if(callBack) callBack();
    });
}
// 擦插入多条数据
dataBase.prototype.insertMany = function(data,callBack){
    var dbase =  this.model.dataBase;
    var _this = this;
    dbase.collection(this.tableName).insertMany(data, function(err, res) {
        if (err) throw err;
        console.log("文档插入成功");
        if(callBack) callBack();
    });
}
// 更新一条数据
dataBase.prototype.updateOne = function(whereStr,updateStr,callBack){
    var dbase =  this.model.dataBase;
    // var updateStr = {$set:{'url':str}};
    // console.log();
    dbase.collection(this.tableName).updateOne(whereStr, updateStr, function(err, res) {
        if (err) throw err;
        console.log("文档更新成功");
        if(callBack) callBack();
    });
}
dataBase.prototype.findOne = function(whereStr,callBack){
    var dbase =  this.model.dataBase;
    console.log(this.tableName);
    console.log(whereStr);
    var data = dbase.collection(this.tableName).findOne(whereStr);
    console.log(data);
    if(data){
        console.log(JSON.stringify(data));
    }
    // if(callBack) callBack(data);
    // .toArray(function(err, item){
    //     if (err) throw err;
    //    
    // });

}
// 查询一条数据
dataBase.prototype.find = function(method,whereStr,callBack){
    var dbase =  this.model.dataBase;
    if(method == 'array'){
        dbase.collection(this.tableName).find(whereStr).toArray(function(err, result) {
            if (err) throw err;
            if(callBack) callBack(result);
        });
    }
    if(method == 'single'){
        dbase.collection(this.tableName).find(whereStr).forEach(function(item){
            if(callBack) callBack(item);
        });
    }
}
module.exports = dataBase;