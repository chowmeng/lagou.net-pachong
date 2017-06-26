var EventEmitter = require('events').EventEmitter;
var event = new EventEmitter();
var superagent = require('superagent');
var request = require('request');
var cheerio = require('cheerio');

console.log('翻页抓取数据');

event.on('some_event', function(result_save) {//被触发的程序，result_save为带入的变量

    cnodeUrl='https://www.lagou.com/jobs/'+result_save.positionId+'.html'//提取所需网页内容的地址
    superagent.get(cnodeUrl)//
      .end(function (err, res) {
        if (err) {
          return console.error(err);
        }
        var $ = cheerio.load(res.text);        // 获取本页所有的链接
        console.log(result_save);
        $('.job_bt').each(function (idx, element) {//获取class=job_bt的全部元素
          var $element = $(element);
          console.log($element.text());

        });
      });
});


for (i = 0; i <= 10; i++) {//这里对10业内容进行爬取
  console.log('第' + (i + 1) + '页')
  request.post({
  url: 'https://www.lagou.com/jobs/positionAjax.json?px=new&gx=全职&city=北京&needAddtionalResult=false',//工作搜索框，这里的搜索条件。。。。。我也忘了
  form: 'first=false&pn=' + i+1 + '&kd=%E6%B5%8B%E8%AF%95'//这里pn=页数，kd=%E6%B5%8B%E8%AF%95好像表示的是测试
  }, function (err, httpResponse, body) {//返回结果有三个，err, httpResponse, body，我们只取body里面的内容
    userid=JSON.parse(body).content.positionResult.result//JSON.parse(body)是将body中的内容转为json格式，后面.content.positionResult.result都是对json格式内容的提取
    userid.forEach(function(key){//对userid中的内容进行遍历
      var result_save={positionName:key.positionName,
        companyShortName:key.companyShortName,
        salary:key.salary,
        positionId:key.positionId}
        event.emit('some_event',result_save);//每获取到一组result_save，进出发一次“some_event”
  

    })
  })

}
