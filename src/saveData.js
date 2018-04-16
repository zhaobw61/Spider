var path = require('path');
var fs = require('fs');
var dirPath = path.resolve();
function saveData(fileName,content,callBack){
    typeof(content) == 'object' ? content = JSON.stringify(content,null,4):content = content;
    fs.writeFile(dirPath+fileName,content,function(){
        if(callBack){
            callBack();    
        }
    })
    console.log('save '+fileName+' success!');
}
module.exports = saveData;