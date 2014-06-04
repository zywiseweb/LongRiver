
var _server = []; //存放服务器ID
var userSum = {
        id:1000,
        name:'总和',
        data:[]
};
var serverUser = function(json){
   _server.push(userSum)
    for (var i = 0; i < json.length; i++) {
            // 横轴坐标
        var id = json[i].server;
        var date= new Date(json[i].time).getTime()+3600000*8; 
        var object = [
            date,
            json[i].count
        ];
       addSum(object);
        addPoint(id,object);     
        
    }
   // _server.push(userSum);
    console.log(_server);

    $('#container').highcharts({
        chart: {
            type: 'spline'
        },

        title: {
            text: '24小时账号变化趋势'
        },
            
        xAxis: {
            type: 'datetime',
            tickPixelInterval : 150,
            tickWidth:5,//刻度的宽度
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
            text: '可用账号数量（个）'
        },
        min: 0
        },    
        series: _server
        });
  
};

var addPoint =function(serverID,object){
   
    for(var i = 0; i < _server.length; i++){
        if(_server[i].id == serverID){
            _server[i].data.push(object);
            return;
        }
    }
    var newServer = {
        id:serverID,
        name:'服务器'+serverID,
        data:[]
    };
    newServer.data.push(object);
    _server.push(newServer);
    
}
/**
* 叠加服务器可用账号综合
*/

function addSum(s){
   // var dateArray = userSum.data;
   var sum = [s[0],s[1]];
    for(var i = 0; i <userSum.data.length; i++){
        if(sum[0] == userSum.data[i][0]){
            userSum.data[i][1] = userSum.data[i][1]+sum[1];
            return;
        }   
    }
    userSum.data.push(sum);
}
var ajaxLoadServerUser = function(){
    console.log('call');
	$.ajax({ 
    	url: "/24HServerUser", 
    	dataType: "json", 
    	success: function(json){
    		serverUser(json);
            //console.log(json);
     	},
     	error:function(XMLHttpRequest, textStatus){
			console.error(textStatus);
        }
    });
};