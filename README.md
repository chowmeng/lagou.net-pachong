# lagou.net-pachong
这是一个拉钩网的爬虫程序，使用nodejs编写。将拉钩网中关于北京+测试的招聘信息进行汇总，并存储每条招聘信息任职条件，通过提取关键词，看看目前那些技术是测试专业最为需要的
拉钩网的网页内容使用ajax编写，翻页是URL不变。

因此在爬内容时，需要发送post报文，并根据返回结果中body的内容，获取到每个招聘信息的地址

1.构建并发送post报文。对返回200ok报文中的body内容进行提取。
  拉钩网网页使用ajax，在翻页时，无法通过修改url中的内容来进行反应，只能通过发送post报文进行“翻页”，并对报文中的内容进行解析
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

2.每次获取到result_save后，根据result_save中的positionId，可以推算出每条招聘信息的url。通过访问url，获取到任职资格中的内容
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
