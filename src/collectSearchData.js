var cheerio = require('cheerio');
var saveData = require('./saveData');
var readFile = require('./readFile');
function collectSearchData(readFileName){
    var searchRes = readFile(readFileName);
    // 记录最大的页数
    var maxPage = 0;
    // 请求搜索页面的数据
    var $ = cheerio.load(searchRes,{decodeEntities: false});
    var newList = $("#wrap").find('#result').find('.box-result');
    var tempArr = [];
    var tempObj;
    for(var i=0;i<newList.length;i++){
        tempObj = {}
        tempObj.newUrl = $(newList[i]).find('h2').children('a').attr('href');
        tempObj.newName = $(newList[i]).find('h2').children('a').text();
        tempObj.content = $(newList[i]).find('.content').text();
        tempArr.push(tempObj);
    }
    var pageNoArr = $('#_function_code_page').children('a');
    for(var j=0;j<pageNoArr.length;j++){
        if(Number($(pageNoArr[j]).html())){
            if(Number($(pageNoArr[j]).html())>maxPage){
                maxPage = Number($(pageNoArr[j]).html());
            }
        }
    }
    return {"data":tempArr,"maxPage":maxPage};
}
module.exports = collectSearchData;
