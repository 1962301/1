var upColor = '#ec0000';
var upBorderColor = '#8A0000';
var downColor = '#00da3c';
var downBorderColor = '#008F28';
export var webAddress="";//'http://192.168.1.8:5000';//"";

export var echartSetting={
            title:{
            	left:10,
            	textStyle:{
            		fontSize:12
            	}
            },
            tooltip:{
            	trigger:'axis',
            	axisPointer:{type:'cross'}
            },
            axisPointer: {
	            link: {xAxisIndex: 'all'},
	            label: {
	                backgroundColor: '#777'
	            }
	        },
            grid:[
	            {
	            	top:"10%",
	                left: '10%',
	                right: '8%',
	                height: '50%'
	            },
	            {
	                left: '10%',
	                right: '8%',
	                top: '75%',
	                height: '13%'
	            }
            ],
            xAxis:[
	            {
	            	type:'category',
	            	data:[],
	            	scale:true,
	            	boundaryGap:true,
	            	axisLine: {
	            		onZero: false
	            	},
	            	splitLine: {
	            		show: false
	            	},
	            	splitNumber: 20,
	            	min: 'dataMin',
	            	max: 'dataMax'
	            },
	            {
	            	type:'category',
	            	gridIndex: 1,
	            	data:[],
	            	scale:true,
	            	boundaryGap:true,
	            	axisLabel: 	{show: false},
	            	axisTick: 	{show: false},
	            	axisLine: 	{onZero: false},
	            	splitLine: 	{show: false},
	            	splitNumber: 20,
	            	min: 'dataMin',
	            	max: 'dataMax'
	            }
            ],
            yAxis: [
	            {
	                scale: true,
	                splitArea: {
	                    show: true
	                }
	            },
	            {
	            	scale: true,
	                gridIndex: 1,
	                splitNumber: 2,
	                axisLabel: {show: true},
	                axisLine: {show: true},
	                axisTick: {show: true},
	                splitLine: {show: false}
	            }
	        ],
            dataZoom: [
                {
                    type: 'inside',
                    xAxisIndex: [0, 1],
                    startValue: 0,
                    endValue: 100,
                    minValueSpan:10,
                    maxValueSpan:100
                },
                {
                    show: true,
                    type: 'slider',
                    xAxisIndex: [0, 1],
                    //y: '93%',
                    startValue: 0,
                    endValue: 100,
                    minValueSpan:10,
                    maxValueSpan:100,
                    left:"15%",
                    right:"15%",
                    top:"92%",
                    bottom:"3%"
                }
            ],
            series: [
                {
                    name: '日K',
                    type: 'candlestick',
                    data:[],
                    itemStyle: {
                        normal: {
                           	color: upColor,
                            color0: downColor,
                            borderColor: upBorderColor,
                            borderColor0: downBorderColor
                        }
                    },
                },
                {
                	name: 'volumne',
                	type: 'bar',
                	xAxisIndex: 1,
                	yAxisIndex: 1,
                	data:[]
                }
            ]
        };
    

