import React from "react";
import style from "./Introduction.css";
import {addInfo} from "./store.js";
import {connect} from"react-redux";

class Introduction extends React.Component{
	constructor(props){
		super(props);
		this.state={
			next:0
		}
		this.para={};
		this.timer=0;
	}

	next=()=>{
		if(this.state.next==0){
			this.checkExampleAvailable();
		}
		else{
			if(this.state.next==1){
				document.getElementById("Example").nextSibling.style.display="block";
				document.getElementById("Example/data").nextSibling.style.display="block";
				document.getElementById("Example/Strategy").nextSibling.style.display="block";
				this.para=document.getElementById("Example/data/testBrentOilData.data").getBoundingClientRect();
			}
			else if(this.state.next==2){
				this.para.echartPosition=document.getElementById("echart").getBoundingClientRect();
			}
			else if(this.state.next==3){
				this.para=document.getElementById("Example/Strategy/Oil_Brent_Crude.str").getBoundingClientRect();
				this.para.ifPosition=document.getElementById("1").getBoundingClientRect();
			}
			else if(this.state.next==4){
				this.para=document.getElementById("consoleDiv").getBoundingClientRect();
			}
			else if(this.state.next==5){
				this.para=document.getElementById("strategy_Run").getBoundingClientRect();
			}
			else if(this.state.next==6){
				document.getElementById("runSettingDiv").style.visibility="visible";
				this.para=document.getElementById("runSettingDiv").getBoundingClientRect();
			}
			else if(this.state.next==7){
				this.para=document.getElementById("resultDiv").getBoundingClientRect();
			}
			else{
				this.skip();
				this.setState({next:0});
			}
			this.setState({next:this.state.next+1});
		}
	}

	checkExampleAvailable=()=>{
		console.log("check="+this.timer);
		if(document.getElementById("Example")){
			this.para=document.getElementById("Example").getBoundingClientRect();
			this.setState({next:this.state.next+1});
		}
		else if(this.timer<20){
			this.timer++;
			setTimeout(this.checkExampleAvailable,500);
		}
		else {
			this.skip();
			this.props.addInfo([{type:"error",info:"please check your internet connection/try reload page"}]);
		}
	}

	skip(){
		if(document.getElementById("Example/data")) document.getElementById("Example/data").nextSibling.style.display="none";
		if(document.getElementById("Example/Strategy")) document.getElementById("Example/Strategy").nextSibling.style.display="none";
		document.getElementById("runSettingDiv").style.visibility="hidden";
		document.getElementById("introDiv").style.display="none";
	}


	tip0(){
		return(
			<div id="intro0" style={{width:"100%",height:"40%",textAlign:"center"}} className={(this.state.next==0?style.tipsDivShow:style.tipsDiv)+" "+style.blockStyle}>
				<h1>welcome to openquant</h1>
				<h2>click SKIP to skip this introduction, click anywhere else to next tips for how to use this demo</h2>
			</div>
		)
	}

	tip1(){
		return(
			<div id="intro1" style={{position:"absolute"}}className={this.state.next==1?style.tipsDivShow:style.tipsDiv}>
				<img src="./imgs/hand2.png" style={{position:"fixed",left:(this.para.left+30)+"px",top:(this.para.top+30)+"px"}} className={style.hand}></img>
				<div className={style.blockStyle}style={{position:"fixed",left:(this.para.left+65)+"px",top:(this.para.top+50)+"px",backgroundColor:"white",width:"250px"}}>
					<p style={{margin:"0px"}}>To expand and collapse folders, just click on it</p>
				</div>
			</div>
		);
	}
	tip2(){
		return(
			<div id="intro2" style={{position:"absolute"}}className={(this.state.next==2||this.state.next==3)?style.tipsDivShow:style.tipsDiv}>
				<img src="./imgs/hand2.png" style={{position:"fixed",left:(this.para.left+30)+"px",top:(this.para.top+30)+"px"}} className={style.hand}></img>
				<div className={style.blockStyle}style={{position:"fixed",left:(this.para.left+65)+"px",top:(this.para.top+50)+"px",backgroundColor:"white",width:"250px"}}>
					{this.state.next==2?<p style={{margin:"0px"}}>double click to open a file</p>:null}
					{this.state.next==3?
						(<div>
							<p style={{margin:"0px"}}>filename with an extension of ".data" is a data file and data can be viewed in the graph</p>
							<img src="./imgs/arrow2.png" style={{position:"fixed",left:(this.para.echartPosition.left-50)+"px",top:(this.para.echartPosition.top+50)+"px"}}></img>
							<div className={style.blockStyle} style={{position:"fixed",left:(this.para.echartPosition.left+140)+"px",top:(this.para.echartPosition.top+90)+"px",fontSize:"25px"}}> graph area</div>
						</div>)
						:null
					}
				</div>
			</div>
		)
	}
	tip4(){
		if(this.state.next==4){
			return(
				<div id="intro4" style={{position:"absolute"}}className={(this.state.next==4)?style.tipsDivShow:style.tipsDiv}>
					<img src="./imgs/hand2.png" style={{position:"fixed",left:(this.para.left+30)+"px",top:(this.para.top+30)+"px"}} className={style.hand}></img>
					<div className={style.blockStyle}style={{position:"fixed",left:(this.para.left+65)+"px",top:(this.para.top+50)+"px",backgroundColor:"white",width:"250px"}}>
						<p style={{margin:"0px"}}>filename with an extension of ".str" is a strategy file and will be shown in logical area</p>
						<img src="./imgs/arrow7.png" style={{position:"fixed",left:(this.para.ifPosition.left-140)+"px",top:(this.para.ifPosition.top-50)+"px"}}></img>
						<div className={style.blockStyle} style={{position:"fixed",left:(this.para.ifPosition.left-160)+"px",top:(this.para.ifPosition.top+15)+"px",fontSize:"25px"}}> Logical area</div>
					</div>
				</div>
			)
		}
		else return null;
	}
	tip5(){
		if(this.state.next==5){
			return(
				<div id="intro5" style={{position:"absolute"}}className={(this.state.next==5)?style.tipsDivShow:style.tipsDiv}>
					<img src="./imgs/hand3.png" style={{position:"fixed",left:(this.para.left-50)+"px",top:(this.para.top+30)+"px"}} className={style.hand2}></img>
					<div className={style.blockStyle}style={{position:"fixed",left:(this.para.left-265)+"px",top:(this.para.top+70)+"px",backgroundColor:"white",width:"250px"}}>
						<p style={{margin:"0px"}}>some erros and some server infomation will be shown here</p>
					</div>
				</div>
			)
		}
		else return null;
	}
	tip6(){
		if(this.state.next==6){
			return(
				<div id="intro6" style={{position:"absolute"}}className={(this.state.next==6)?style.tipsDivShow:style.tipsDiv}>
					<img src="./imgs/hand4.png" style={{position:"fixed",left:(this.para.right+50)+"px",top:(this.para.top)+"px"}} className={style.hand2}></img>
					<div className={style.blockStyle}style={{position:"fixed",left:(this.para.right+100)+"px",top:(this.para.top)+"px",backgroundColor:"white",width:"250px"}}>
						<p style={{margin:"0px"}}>finish edit logical file, click run</p>
					</div>
				</div>
			)
		}
		else return null;
	}
	tip7(){
		if(this.state.next==7){
			return(
				<div id="intro7" style={{position:"absolute"}}className={(this.state.next==7)?style.tipsDivShow:style.tipsDiv}>
					<img src="./imgs/hand4.png" style={{position:"fixed",left:(this.para.right+30)+"px",top:(this.para.top)+"px"}} className={style.hand2}></img>
					<div className={style.blockStyle}style={{position:"fixed",left:(this.para.right+80)+"px",top:(this.para.top)+"px",backgroundColor:"white",width:"350px"}}>
						<p style={{margin:"0px"}}>Select data file you want to use as testing data. </p>
						<p style={{margin:"0px"}}>Leave start and end Date black if you don't have any perference. </p>
						<p style={{margin:"0px"}}>The maximum data length used in calculation is limited by 20000 </p>
					</div>
				</div>
			)
		}
		else return null;
	}
	tip8(){
		if(this.state.next==8){
			return(
				<div id="intro8" style={{position:"absolute"}}className={(this.state.next==8)?style.tipsDivShow:style.tipsDiv}>
					<img src="./imgs/hand3.png" style={{position:"fixed",left:(this.para.left-50)+"px",top:(this.para.top+30)+"px"}} className={style.hand2}></img>
					<div className={style.blockStyle}style={{position:"fixed",left:(this.para.left-265)+"px",top:(this.para.top+70)+"px",backgroundColor:"white",width:"250px"}}>
						<p style={{margin:"0px"}}>After running logical file, the calculation results will be shown here, the result can be viewed on graph by double click each result</p>
					</div>
				</div>
			)
		}
		else return null;
	}

	render(){
		return (
			<div id="introDiv" style={{width:"100%",height:"100%",position:"absolute",left:"0px",top:"0px",zIndex:"1"}} onClick={this.next}>
				<div style={{width:"100%",height:"100%",position:"absolute",left:"0px",top:"0px",opacity:"0.2",backgroundColor:"gray"}}></div>
				{this.tip0()}
				{this.tip1()}
				{this.tip2()}
				{this.tip4()}
				{this.tip5()}
				{this.tip6()}
				{this.tip7()}
				{this.tip8()}
				<button onClick={this.skip} className={style.blockStyle}style={{width:"90px",height:"40px",fontSize:"30px",outline:"none",border:"none",position:"fixed",top:(window.innerHeight-100)+"px",left:"20px",cursor:"pointer"}}>Skip</button>
			</div>
		);
	}
}

export default connect(null,{addInfo})(Introduction);