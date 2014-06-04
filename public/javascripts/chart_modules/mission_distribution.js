var missDistribution = function(json){
//console.log("绘图");
console.log("结果数量："+ json.length);
  var series=[];
   var series_ok=[];
   var series_err=[];
   var series_wait=[];
 for (var i = 0; i < json.length; i++) {
    var mtime = new Date(json[i].time).getTime()+3600000*8;
        var point  = [mtime,json[i].sID];
      // console.log(mtime);
        if(json[i].status === 0){ //没有执行
             series_wait.push(point)
        }else if(json[i].status === 1){//ok
            series_ok.push(point)
        }else if(json[i].status === 2){//err
            series_err.push(point)
        }

        //series_err.push(point)

   }
   console.log("等待:"+ series_wait.length);
   console.log("成功:"+ series_ok.length);
   console.log("失败:"+ series_err.length);

  /* series.push({
        name: '等待执行',
        color: 'rgba(0, 0, 255, .5)',
        data:series_wait
   });
*/
  series.push({
        name: '执行成功',
        color: 'rgba(0, 255, 0, .2)',
        data:series_ok
    
   });

   series.push({
        name: '执行失败',
        color: 'rgba(255, 0, 0, .5)',
        data:series_err
    
   });


$('#container').highcharts({
            chart: {
                type: 'scatter',
            },
            global: { useUTC: false } ,
            title: {
                text: '任务分布'
            },
            
            xAxis: {
                type:"datetime",//时间轴要加上这个type，默认是linear
               
                //tickInterval : 24 * 3600 * 1000 * 2,//两天画一个x刻度
                                //或者150px画一个x刻度，如果跟上面那个一起设置了，则以最大的间隔为准
                tickPixelInterval : 150,
                dateTimeLabelFormats: {
                second: '%Y-%m-%d<br/>%H:%M:%S',
                minute: '%Y-%m-%d<br/>%H:%M',
                hour: '%Y-%m-%d<br/>%H:%M',
                day: '%Y<br/>%m-%d',
                week: '%Y<br/>%m-%d',
                month: '%Y-%m',
                year: '%Y'
            }
               
            },
            yAxis: {
                
                title: {
                    text: '服务器ID'
                },
                tickInterval : 1
            },
             tooltip: {
                formatter: function() {
                        return '<b>'+ this.series.name +'</b><br/>'
                        + '<b>执行服务器:'+ this.y+'</b><br/>'
                        +Highcharts.dateFormat('执行时间:%H:%M:%S', this.x) ;
                }
            },
            
           
            series:series
        });
  

}