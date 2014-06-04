var flagDistribution = function(json){

    var _server = []; //存放服务器ID
    var _flags = []; //存放flag类型
    var series_column= []; //存放图标对象
    var series_pie ;
//横轴坐标 和 falg 类型

    for (var i = 0; i < json.length; i++) {
            // 横轴坐标
        var id = json[i].server;
           // console.info(id);
        if(!contains(_server,id)){
            _server.push(id);
        }
        var flag = json[i].flag;
        if(!contains(_flags,flag)){
            _flags.push(flag);
                
        }
          
    }
    _server.sort();
    _flags.sort();
//生成坐标轴
    for(var i = 0; i < _flags.length; i++){

        var colum={};
        colum.dataLabels = {enabled :true};
        colum.type='column';
        if(_flags[i]==0){
            colum.name='可用';
        }else if(_flags[i]==1){
            colum.name='不可用';
        }else{
            colum.name='异常';
        }
        colum.data=[];
        for(var j = 0; j < _server.length; j++){
            var count = 0;
            for (var k = 0; k < json.length; k++) {
                if(json[k].server ==_server[j]&&json[k].flag ==_flags[i]){
                    count=json[k].count  
                    break;
                }
            }
             colum.data.push(count);
        }
        series_column.push(colum);
    }

    //服务器账号分布
    var serverPie ={
         type: 'pie',
                name: '服务器账号',
         center: [80, 0],
                size: 100,
                showInLegend: false,
                dataLabels: {
                    enabled: false
                }
    };
     var serverPieData = [];

     for(var j = 0; j < _server.length; j++){
        var server = {};
        server.name = '服务器'+_server[j];
        var ynum = 0;
         for (var k = 0; k < json.length; k++) {
                if(json[k].server ==_server[j]){
                    ynum=ynum+json[k].count  
                }
            }
          server.y=  ynum;

        serverPieData.push(server);
     }
     serverPie.data = serverPieData;
     series_column.push(serverPie);
    
//总量统计

 var userPie ={
         type: 'pie',
                name: '账号统计',
         center: [260, 0],
                size: 100,
                showInLegend: false,
                dataLabels: {
                    enabled: false
                }
       
        
            
    };
     var userPieData = [];

    for(var i = 0; i < _flags.length; i++){

        var colum={};
        
        var _flag= _flags[i];

        if(_flag==0){
            colum.name='可用:'+_flag;
        }else if(_flag==1){
            colum.name='不可用:'+_flag;
        }else{
            colum.name='异常:'+_flag;
        }

        var num = 0;


        for (var k = 0; k < json.length; k++) {
                if(json[k].flag ==_flag){
                    num=num+json[k].count  
                }
            }
        colum.y = num;

       
        userPieData.push(colum);
    }
    userPie.data = userPieData;

     series_column.push(userPie);


console.log(series_column);
//生成图标
  $('#container').highcharts({
            chart: {
            },
            title: {
                text: '账号分布'
            },
            xAxis: {
                title:"服务器",
                categories: _server

            },
            yAxis: {
                title:{
                    text:'账号数量'
                },
                 stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                }
            },
           
             
            tooltip: {
                
                formatter: function() {
                    var s;
                    if (this.point.name) { // the pie chart
                        s = ''+
                            this.point.name +': '+ this.y +' 个';
                    } else {
                        s =  this.y;
                    }
                    return s;
                }
            },

            
            series: series_column
        });
  

}
var contains = function(arr,obj) {
        var i = arr.length;
        while(i --) {
        if (arr[i] === obj) {
            return true;
        };
        }
        return false;
} ;


//发送请求
var ajaxLoadFlagDistribution = function(){
	$.ajax({ 
    		url: "/userdistribution", 
    		   dataType: "json", 
    		 success: function(json){
                console.info(json);
    		 	flagDistribution(json);
                
     		 },
     		 error:function(XMLHttpRequest, textStatus){
					console.error(textStatus);
     		 }
     		 

 		 });
    
};