import React from 'react';
import {connect,Provider} from"react-redux";
import {mapStateToProps_Logical,setCondition_Logical,setAction_Logical,setActiveID_Logical,setConFile_Logical,setConFile_OtherParameters,setConFileName_Logical,setResult,addInfo,setDataFileName} from "./store.js";
import style from "./Editor_LogicalArea.css";
import {ajaxSend,formatConsoleInfo} from "./Func.js";

class Editor_LogicalArea extends React.Component{
	constructor(props){
		super(props);
		this.limit=65525;
		this.IDarr=[];
		this.spanId="";
		this.isSaveStart=false;
		this.isRun=false;
		this.state={
			numPoints:20000,
			startDate:"",
			startTime:"",
			endDate:"",
			endTime:""
		}
		this.fileSelect="";
		this.dataFileArr=[];

		for(let i=1;i<=this.limit;i++)	this.IDarr.push(i);
	}
	componentDidUpdate(){
		console.log("datafilearr=");
		console.log(this.dataFileArr);
		this.fileSelect="";
		this.dataFileArr.forEach((item,i)=>document.getElementById("fileSelect"+i).checked=false);
	}

	getNewID(){
		return this.IDarr.splice(Math.floor(Math.random()*this.IDarr.length),1)[0];
	}
	getParseID(id){ 
		return Number(id)?id:id.slice(3); 
	}
	getCopyFile(){ 
		return JSON.parse(JSON.stringify(this.props.conFile)) 
	};
	getNewCon(prop,t,f){
		return {type:prop=="t"?"if":"else if",condition:"",t:t?t:"action",f:f?f:"",action:""};
	}
	putIDBack(id,obj){
		delete obj[id];
		this.IDarr.push(id);
	}
	addNewLi(e,prop){
		e.preventDefault();
		let [id, tempFile, newID]=[this.getParseID(e.target.id),this.getCopyFile(),this.getNewID()];
		tempFile[newID]=this.getNewCon(prop,null,tempFile[id][prop]=="action"?"":tempFile[id][prop]);
		tempFile[id][prop]=newID;
		if(prop=="t"&&Number(tempFile[newID].f)) tempFile[tempFile[newID].f].type="else if";
		return ["con"+newID,tempFile];
	}
	getChild(id){
		return <ul className={style.ul} key={"ul"+id}>{this.getLi(id)}</ul>;
	}
	getLi(id){
		let el=[];
		while(id!=""){
			el.push(
				<li key={id} id={id} className={style.li+" "+(this.getParseID(this.props.activeID)==id?style.activeLi:"")}>
					<span id={"spa"+id} onMouseDown={this.spanMouseDown}>{this.props.conFile[id].type=="else"?"else":(this.props.conFile[id].type+" ( ")}</span>
					<input 	className={this.props.conFile[id].type=="else"?style.nonInput:style.conInput} id={"con"+id} key={"con"+id} value={this.props.conFile[id].type=="else"?"":this.props.conFile[id].condition} onChange={this.inputChange} onFocus={this.inputFocus} onKeyDown={this.inputKeyDown}/>
					{this.props.conFile[id].type=="else"?"":" )"}
					{Number(this.props.conFile[id].t)?false:this.getAction(id)}
					<button className={style.delButton} id={"del"+id} onClick={this.del}>x</button> 
				</li>
			)
			el.push(Number(this.props.conFile[id].t)?this.getChild(this.props.conFile[id].t):false) ;
			id=this.props.conFile[id].f;
		}
		return el;
	}
	getAction(id){
		return (
			<div className={style.actionDiv} >
				<div className={style.arrowDiv1}></div>
				<div className={style.arrowDiv2}></div>
				<input id={"act"+id} className={style.actionInput} placeholder="please enter" value={this.props.conFile[id].action} onChange={this.actionChange} onFocus={this.inputFocus} autoComplete="off"/>
			</div>
		);
	}

	inputFocus=  (e) => {if(this.props.conFile[this.getParseID(e.target.id)].type!="else"||!e.target.id.includes("con"))this.props.setActiveID_Logical(e.target.id) }
	inputChange= (e) => { this.props.setCondition_Logical(e.target.id.slice(3),e.target.value) }
	actionChange=(e) => { this.props.setAction_Logical(e.target.id,e.target.value) }
	inputKeyDown=(e)=>{
		if(e.keyCode==13){
			e.preventDefault();
			this.props.setConFile_Logical(...this.addNewLi(e,e.ctrlKey?"t":"f"));
		}
		else if(e.keyCode==9){
			e.preventDefault();
			let [id, tempFile]=[this.getParseID(e.target.id),this.getCopyFile()];
			if(tempFile[id].t=="action")	{ document.getElementById("act"+id).focus(); }
			else if(confirm("add new action will delete all children of this")){
				let delArr=[];
				this._del(tempFile[id].t,delArr,tempFile);
				delArr.forEach(i=>this.putIDBack(i,tempFile));
				tempFile[id].t="action";
				this.props.setConFile_Logical(e.target.id,tempFile);
			}
		}
		else if(this.props.conFile[this.getParseID(e.target.id)].type=="else"&&e.target.id.includes("con")) e.preventDefault();
	}
	del=(e)=>{
		let [id, tempFile]=[this.getParseID(e.target.id),this.getCopyFile()];
		let delArr=[id];

		if(Number(tempFile[id].t))	this._del(tempFile[id].t,delArr,tempFile);
		
		let key=Object.keys(tempFile).find(i=>{ return tempFile[i].t==id||tempFile[i].f==id})
		let found=tempFile[key];
		if(found.t==id){
			found.t=tempFile[id].f==""?"action":tempFile[id].f;
			if(tempFile[id].f!="") tempFile[tempFile[id].f].type="if";
		}
		else if(found.f==id) 	found.f=tempFile[id].f;	

		delArr.forEach(i=>{this.putIDBack(i,tempFile)});
		if(tempFile.entry.t=="action") tempFile={entry:{t:"1"},1:this.getNewCon("t")};
		this.props.setConFile_Logical("con"+key,tempFile);			
	}
	_del(id,arr,tempFile){
		arr.push(id);
		["t","f"].forEach(item=>{ if(Number(tempFile[id][item])) this._del(tempFile[id][item],arr,tempFile)});
	}
	spanMouseDown=(e)=>{
		e.preventDefault();
		let ul=document.getElementById("typeList");
		if(this.spanId==e.target.id&&ul.style.visibility=="visible")  ul.style.visibility="hidden";
		else if(e.target.innerText.match(/^if/)) {	ul.style.visibility="hidden";	}
		else{
			let name=e.target.innerText.match(/^else if/)?"else":"else if";
			this.spanId=e.target.id;
			ul.style.visibility="visible";
			let rect=e.target.getBoundingClientRect();
			ul.style.top=rect.bottom+"px";
			ul.style.left=rect.left+"px";
			ul.focus();
			ul.firstChild.innerText=name;
		}	
	}

	typeListBlur(e){
		e.target.style.visibility="hidden";
	}
	typeListClick=(e)=>{
		let [id,tempFile]=[this.getParseID(this.spanId),this.getCopyFile()];
		console.log("id="+id);
		console.log(tempFile);
		if(e.target.innerText.match(/^else if/)){
			[tempFile[id].type,tempFile[id].condition]=["else if",""];			
		}
		else if(e.target.innerText.match(/^else/)){
			let delArr=[];
			if(tempFile[id].f!=""){
				this._del(tempFile[id].f,delArr,tempFile);
				delArr.forEach(i=>this.putIDBack(i,tempFile));
			}
			[tempFile[id].type, tempFile[id].condition,tempFile[id].f]=["else","none",""];
		}
		console.log(tempFile);
		console.log(this.props.conFile);


		this.props.setConFile_Logical("con"+id,tempFile);
		document.getElementById("typeList").style.visibility="hidden";
	}
	waitForNextCandleClick=(e)=>{
		let tempFile=this.getCopyFile();
		tempFile.otherParameters.waitForNextCandle=e.target.checked?"true":"false";
		console.log(e.target.checked);
		this.props.setConFile_OtherParameters(tempFile);
	}

	save=(e,func)=>{
		if(!this.isSaveStart){
			this.isSaveStart=true;
			if(this.saveCheck()){
				ajaxSend("POST","/save",(response)=>{
					if(response.error==undefined){	if(func) func(response);	}
					else{
						this.props.addInfo(formatConsoleInfo(response));
						this.isRun=false;
					}
					this.isSaveStart=false;
				},JSON.stringify({fileContent:this.props.conFile,fileName:this.props.conFileName}),null,()=>{this.isRun=false;this.isSaveStart=false;});
			}
			else this.isSaveStart=false;
		}
	}

	
	run=(e)=>{
		if(!this.isRun){
			this.isRun=true;
			this.props.addInfo([{type:"normal",info:"start to calculate"}]);
			if(this.runSettingCheck()){
				let [startDate,startTime,endDate,endTime]=this.getDateTime();
				let startDateTime=startDate==""?"":startDate+(startTime==""?" 00:00:00":(" "+startTime));
				let endDateTime=endDate==""?"":endDate+(endTime==""?" 00:00:00":(" "+endTime));

				this.save(null,()=>{
						this.props.setDataFileName(this.fileSelect.slice(1));
						ajaxSend("POST","/run",(response)=>{
							if(response.data!=undefined) 		this.props.setResult(response.data);
							else if(response.error!=undefined)	this.props.addInfo([{type:"error",info:response.error}]);
							this.isRun=false;
							},JSON.stringify({strategyFile:this.props.conFileName,dataFile:this.fileSelect,startDateTime:startDateTime,endDateTime:endDateTime,numPoints:document.getElementById("numInput").value}),
							null,()=>{this.isRun=false}
						);
						this.isRun=false;
				});
			}
		}
		document.getElementById("runSettingDiv").style.visibility="hidden";

	}

	saveCheck(){
		return true;
	}

	getDateTime(){
		return [document.getElementById("startDate").value,document.getElementById("startTime").value,document.getElementById("endDate").value,document.getElementById("endTime").value];
	}

	runSettingCheck(){
		let [startDate,startTime,endDate,endTime]=this.getDateTime();

		console.log("startDate="+startDate+"   startTime="+startTime+"   endDate="+endDate+"   endTime="+endTime+"   fileSelect="+this.fileSelect);

		if(startTime!=""&&startDate==""){
			document.getElementById("errorTips").innerText="please select startDate as startTime has been chosen, or delete startTime"
			document.getElementById("startDate").focus();
		}
		else if(endTime!=""&&endDate==""){
			document.getElementById("errorTips").innerText="please select endDate as endTime has been chosen, or delete endTime"
			document.getElementById("endDate").focus();
		}
		else if(this.fileSelect==""){
			document.getElementById("errorTips").innerText="please select a data file"
		}
		else return true;

		return false;
	}


	getDataFiles(obj,path,fileArr){
		for(let [key,value] of Object.entries(obj)) {
			if(typeof value == "object") this.getDataFiles(value,path+"/"+key,fileArr);
			else if(value=="file"&&key.endsWith(".data")) fileArr.push(path+"/"+key);
		}
		return fileArr;
	}

	numInputChange=(e)=>{
		if(e.target.value.match(/\d+/)&&e.target.value<20000) this.setState({numPoints:e.target.value});
	}
	numInputKeyDown=(e)=>{
		if(e.keyCode==190||e.keyCode==110) e.preventDefault();
	}
	fileSelectClick=(e)=>{
		this.fileSelect=e.target.parentNode.lastChild.nodeValue;
	}
	showRunSetting(){
		document.getElementById("runSettingDiv").style.visibility="visible";
		document.getElementById("runSettingDiv").focus();
	}
	hideRunSetting(){
		document.getElementById("runSettingDiv").style.visibility="hidden";
	}

	getRunSelectDiv=(fileSys)=>{
		this.dataFileArr=this.getDataFiles(fileSys,"",[]);
		let t=[];
		this.dataFileArr.forEach((item,i)=>t.push(<li><input id={"fileSelect"+i} key={"fileSelect"+i} type="radio" name="fileSelect" onClick={this.fileSelectClick} /><img src="./imgs/page.gif" className={style.gif}/> {item}</li>));
		return (
			<div id="runSettingDiv" className={style.myStyle+" "+style.runSettingDiv}>
				Select Data File:
				<ul>{t}</ul>
				<span title={"if start datetime is before the earliest data, then start with closest data"}>Start: </span>
				<input id="startDate" className={style.myStyle} type="date"/><input id="startTime" className={style.myStyle}type="time"/>
				<span title={"if end Time is after the lastest data, then end with the lastest data"}>  End: </span>
				<input id="endDate" className={style.myStyle}type="date"/><input id="endTime" className={style.myStyle}type="time"/><br/>
				<span title={"set the number of data points, max 20000,min 0 which means do not run"}>Number of Points: </span>
				<input className={style.myStyle+" "+style.inputNumPoints} id="numInput"type="number" step="1" pattern="\d+" min="0" max="20000" value={this.state.numPoints} onChange={this.numInputChange} onKeyDown={this.numInputKeyDown}/><br/>
				<button onClick={this.hideRunSetting}>Cancel</button>   <button onClick={this.run}>Run</button>      <span id="errorTips" style={{color:"red"}}></span>
			</div>
		)
	}

	render(){
		return(
			<div>
				<div id="fullCandleDiv" className={style.fullCandleDiv}>
					FileName:{this.props.conFileName}<br/>
					<input id="fullCandleInput" type="checkbox" checked={this.props.conFile.otherParameters.waitForNextCandle=="true"?true:false} onChange={this.waitForNextCandleClick}/>full candle available
					<button id="strategy_Save" className={style.strategy_Save} onClick={this.save}>Save</button>
					<button id="strategy_Run"  className={style.strategy_Run} onClick={this.showRunSetting}>Run</button>
					{this.getRunSelectDiv(this.props.fileSys)}
				</div>
				{this.getChild(this.props.conFile.entry.t)}
				<ul id="typeList" className={style.typeList} tabIndex="-1" onBlur={this.typeListBlur} onClick={this.typeListClick}>
					<li className={style.typeListLi}></li>
				</ul>
			</div>	
		);
	}
}

export default connect(mapStateToProps_Logical,{setCondition_Logical,setAction_Logical,setActiveID_Logical,setConFile_Logical,setConFile_OtherParameters,setResult,addInfo,setDataFileName})(Editor_LogicalArea);