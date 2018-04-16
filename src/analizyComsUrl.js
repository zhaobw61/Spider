function analizyComsUrl(){
    var httpNewDetial = readFile('/saveSearch/httpNewDetial.html');
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
}
module.exports = analizyComsUrl;