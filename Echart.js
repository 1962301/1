import React from 'react';
//import echarts from "./echarts.min.js";

import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/candlestick';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';

import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/dataZoom';
import 'echarts/lib/component/markPoint';
//import 'echarts/lib/component/title';



import {echartSetting} from "./Setting.js";
import {mapStateToProps_Echart,setData_Echart} from "./store.js";
import {connect} from 'react-redux';
import {ajaxSend,formatData,getEchartOption,dealGetTargetData} from './Func.js';

class Echart extends React.Component{
    constructor(props){
        super(props);
        this.myChart;
        this.hasMoreData=true;
        this.sendRequest=false;

        this.dataLimitNumber=200;
        this.leftLimit=this.dataLimitNumber*0.5;
        this.rightLimit=this.dataLimitNumber*2.5;
        
        this.markPoint={
            data:[
                { name:'target',
                  coord:[],
                  symbol:'pin',
                  symbolSize:20,
                  itemStyle: {normal: {color: 'rgb(41,60,85)'} }
                }
            ]
        };
    }
    componentDidMount(){
        myChart = echarts.init(document.getElementById('echart'));
        myChart.setOption(echartSetting,true);

        myChart.on('datazoom', (params)=> {

            var option = myChart.getOption();

            let startIndex=option.dataZoom[0].startValue;
            let endIndex=option.dataZoom[0].endValue;           
            
            if(!this.sendRequest&&this.props.data.id.length!=0){
                if(startIndex<this.leftLimit&&this.props.data.id[0]!=1)     this.requireData(true,startIndex,endIndex);
                else if(endIndex>this.rightLimit&&this.hasMoreData)         this.requireData(false,startIndex,endIndex);
             }
        });
    }

    requireData=(insertFront,startIndex,endIndex)=>{
        this.chartLoading();
        let requireOffset=insertFront? (this.props.data.id[0]-this.dataLimitNumber-1) : this.props.data.id[this.props.data.id.length-1];
        if(requireOffset<0) requireOffset=0;

        ajaxSend(   "POST","/getData",
                    (response)=>{
                         let receivedData=formatData(response);
                         let rLength=receivedData.id.length;
                         let sliceOffset=insertFront?(this.props.data.id.length-rLength):rLength;
                         let mergeArrMethod=insertFront?Array.prototype.unshift:Array.prototype.push;
                         let [startValue,endValue]=insertFront?[startIndex+rLength,endIndex+rLength]:[startIndex-rLength,endIndex-rLength];

                         let newData={value:[],id:[],datetime:[],volume:[]};
                         Object.keys(newData).forEach(key=>mergeArrMethod.apply( newData[key] = insertFront?this.props.data[key].slice(0,sliceOffset):this.props.data[key].slice(sliceOffset),     receivedData[key]));

                        this.props.setData_Echart(this.props.dataFileName,newData,getEchartOption(startValue,endValue,[]));
                        this.hasMoreData=insertFront||rLength>=this.dataLimitNumber;
                    },
                     JSON.stringify({"fileName":this.props.dataFileName,offset:requireOffset})
        );
    }

    componentDidUpdate(){
        this.markPoint.data[0].coord=this.props.echartOption.coord;
        var option={
            title:{text:this.props.dataFileName},
            xAxis:[
                { data:this.props.data.datetime },
                { data:this.props.data.datetime }
            ],
            series:[
                { 
                    data:this.props.data.value,
                    markPoint:this.markPoint
                },
                { 
                    data:this.props.data.volume,
                    //markPoint:this.markPoint
                }
            ],
            dataZoom: [
                {
                    startValue: this.props.echartOption.startValue,
                    endValue: this.props.echartOption.endValue,
                },
                {
                    startValue: this.props.echartOption.startValue,
                    endValue: this.props.echartOption.endValue,
                }
            ],
        }

        this.hideLoading();
        myChart.setOption(option,{silent:true});

        this.sendRequest=false;
    }

    buttonClick=(e)=>{
        let date=document.getElementById("echart_Date").value;
        let time=document.getElementById("echart_Time").value;
        if(date!=""&&this.props.dataFileName!=""){
            let datetime=date+(time==""?"":(" "+time));

            ajaxSend(   "POST","/getTargetData",
                        (response)=>{
                            let [data,option]=dealGetTargetData(response,myChart);
                            this.props.setData_Echart(this.props.dataFileName,data,option);
                        },
                        JSON.stringify({"fileName":this.props.dataFileName,timestamp:datetime}));
        }
    }

    chartLoading(){
        this.sendRequest=true;
        document.getElementById("echart").style.pointerEvents="none";
        myChart.showLoading("default",{
            text: 'loading'
        })
    }
    hideLoading(){
        document.getElementById("echart").style.pointerEvents="auto";
        myChart.hideLoading();
    }

    render(){
        return (
            <div>
                <input type="date" id="echart_Date" /> 
                <input type="time" id="echart_Time" />
                <button onClick={this.buttonClick}>GO</button>
                <div id="echart" style={{width: "100%",height:"400px",position:"relative",top:"0px",left:"0px",background: "#e8e8e8",overflow: "auto"}}></div>
            </div>
        )
    }
}

export default connect(mapStateToProps_Echart,{setData_Echart})(Echart);
export var myChart;