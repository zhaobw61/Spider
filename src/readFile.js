var path = require('path');
var fs = require('fs');
var dirPath = path.resolve();
function readFile(fileName){
    // console.log(dirPath+fileName);
    //D:/project/MySpider/Spider/src/saveSearch/inputSearch.html
    var data = fs.readFileSync(dirPath+fileName);
    // console.log(data.toString());
    console.log('read '+fileName+' success!');
    return data.toString();
}
module.exports = readFile;