var userDistribution = function(data){
 $('#userDistribution').highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false
            },
            title:{
            	text:'账号服务器分布'
            },
            tooltip: {
        	   pointFormat: ' <b>{point.percentage}%</b>',
            	percentageDecimals: 1
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        color: '#000000',
                        connectorColor: '#000000',
                        formatter: function() {
                            return '<b>服务器'+ this.point.name +'</b>: '+ this.point.y ;
                        }
                    }
                }
            },
              series: [{
              	 type: 'pie',
                data: data

            }]
        });
}

var ajaxLoadUserDistribution = function(){
	$.ajax({ 
    		url: "/userServer", 
    		   dataType: "json", 
    		 success: function(json){
    		 	 userDistribution(json);
     		 },
     		 error:function(XMLHttpRequest, textStatus){
					console.error(textStatus);
     		 }
     		 

 		 });
    
};