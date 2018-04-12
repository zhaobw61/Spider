var axios = require('axios');

// 新闻名称
var newName = '%B1%A3%C4%B7%D7%DD%BB%F0%B0%B8';

// 收索范围：all新闻全文 title新闻标题
var range = 'all';
// 收索类型
var c = 'news';
// 排序方法
var sort = 'time';
var url = 'http://search.sina.com.cn/?q='+newName+'&range='+range+'&c='+c+'&sort='+sort+'';
// console.log(url);
// axios.get()