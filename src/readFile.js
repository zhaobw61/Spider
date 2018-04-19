var path = require('path');
var fs = require('fs');
var dirPath = path.resolve();
function readFile(fileName){
    var data = fs.readFileSync(dirPath+fileName);
    // console.log('read '+fileName+' success!');
    return data.toString();
}
module.exports = readFile;