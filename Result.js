import React from 'react';
import {mapStateToProps_Result,setData_Echart} from "./store.js";
import {connect} from"react-redux";
import style from "./Result.css";
import {myChart} from "./Echart.js";
import {ajaxSend,formatData,dealGetTargetData} from "./Func.js";


class Result extends React.Component{
	constructor(props){
		super(props);
		this.divMinHeight=300;
		this.isRequireData=false;
	}

	componentDidUpdate(){
		let el=document.getElementById("resultDiv");
		let domRect=el.getBoundingClientRect();
		let windowHeight=window.innerHeight;
		el.style.height=(windowHeight-domRect.top<this.divMinHeight?this.divMinHeight:windowHeight-domRect.top)+"px";
	}


	getUL(arr,index){
		let t=[];
		arr.forEach(item=>t.push(<li style={{"marginLeft":"10px",color:"gray"}}>>>>  {item}</li>));
		return <ul id={"result_ul_"+index} style={{margin:0,padding:0,display:"none"}}>{t}</ul>
	}
	expand=(e)=>{
		e.stopPropagation();
		let id=e.target.id;
		let index=id.slice(id.lastIndexOf("_")+1)
		let targetID="result_ul_"+index;
		let el=document.getElementById(targetID);
		if(el.style.display=="none"){
			el.style.display="block";
			document.getElementById("result_expand_su_"+index).style.borderRightWidth="0px";
		}
		else{
			el.style.display="none";
			document.getElementById("result_expand_su_"+index).style.borderRightWidth="2px";		
		}
	}
	trackData=(e)=>{
		let index=e.target.id.slice(e.target.id.lastIndexOf("_")+1);
		let datetime=this.props.result[index][0].slice(0,this.props.result[index][0].lastIndexOf(":"));

        ajaxSend("POST","/getTargetData",(response)=>{
			let [data,option]=dealGetTargetData(response,myChart);
            this.props.setData_Echart(this.props.dataFileName,data,option);

        }, JSON.stringify({"fileName":this.props.dataFileName,timestamp:datetime}));
    }

	getResult=(arr)=>{
		let t=[];
		arr.forEach((item,index)=>{
			t.push(<div id={"result_div_"+index} className={style.resultItemDiv}>
						<div id={"result_summary_"+index} style={{position:"relative",display:"inline-block",width:"100%"}} onDoubleClick={this.trackData} title={"double click to show data"}>
							{index}: {item[0]}
							<div id={"result_expand_"+index} className={style.expandDiv} onClick={this.expand} onDoubleClick={(e)=>{e.stopPropagation()}}>
								<div id={"result_expand_heng_"+index}className={style.heng}></div>
								<div id={"result_expand_su_"+index}className={style.su}></div>
							</div>
						</div>
						{this.getUL(item.slice(1),index)}

					</div>);
		});
		return t;
	}
	
	render(){
		return(
			<div id="resultDiv" className={style.resultDiv}>
				<p>Result:</p>
				{this.getResult(this.props.result)}
			</div>
		);
	}
}

export default connect(mapStateToProps_Result,{setData_Echart})(Result);