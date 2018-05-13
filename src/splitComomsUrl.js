var cheerio = require('cheerio');
function splitComomsUrl(data){
    var httpNewDetial = data;
    var $ = cheerio.load(httpNewDetial,{decodeEntities: false});
    var metaArr = $('meta[name="sudameta"]');
    var aR = [];
    for(var i=0;i<metaArr.length;i++){
        var aK = $(metaArr[i]).attr("content");
        if (aK) {
            if (aK.indexOf(";") != -1) {
                var D = aK.split(";");
                for (var aH = 0; aH < D.length; aH++) {
                    var aP = aw(D[aH]);
                    if (!aP) {
                        continue
                    }
                    aR.push(aP)
                }
            } else {
                aR.push(aK)
            }
        }
    }
    function aw(aH) {
        if (typeof aH !== "string") {
            throw "trim need a string as parameter"
        }
        var e = aH.length;
        var D = 0;
        var i = /(\u3000|\s|\t|\u00A0)/;
        while (D < e) {
            if (!i.test(aH.charAt(D))) {
                break
            }
            D += 1
        }
        while (e > D) {
            if (!i.test(aH.charAt(e - 1))) {
                break
            }
            e -= 1
        }
        return aH.slice(D, e)
    }
    var tempObj = {};
    for(var i=0;i<aR.length;i++){
        var tempArr = aR[i].split(":");
        tempObj[tempArr[0]] = tempArr[1];
    }
    // console.log(tempObj);
    var commentsArrUrl = 'http://comment5.news.sina.com.cn/page/info?version=1&format=js&channel='+tempObj['comment_channel']+'&newsid='+tempObj['comment_id']+'&group=&compress=0&ie=gbk&oe=gbk&page=1&page_size=20';
    var resultObj = {
        commentsArrUrl:commentsArrUrl,
        channel:tempObj['comment_channel'],
        newsid:tempObj['comment_id'],

    }
    return resultObj;
}

module.exports = splitComomsUrl;