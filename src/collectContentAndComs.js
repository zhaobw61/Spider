var splitComomsUrl =require('./splitComomsUrl');
var cheerio = require('cheerio');
function collectContentAndComs(data){
    // 获取评论链接
    var splitResObj = splitComomsUrl(data)
    var commentsUrl = splitResObj.commentsArrUrl;
    // 获取新闻的内容
    var $ = cheerio.load(data,{decodeEntities: false});
    var newContentPArr = [];
    if($('#artibody').length != 0 ){
        newContentPArr = $('#artibody').children('div').children('p');
    }
    if($('#article').length != 0 ){
        newContentPArr = $('#article').children('p');
    }
    var newContent = '';
    for(var i=0;i<newContentPArr.length;i++){
        newContent += $(newContentPArr[i]).html().trim();
    }
    return {'newContent':newContent,'commentsUrl':commentsUrl, 'channel':splitResObj['channel'],'newsid':splitResObj['newsid']};
}
module.exports = collectContentAndComs;