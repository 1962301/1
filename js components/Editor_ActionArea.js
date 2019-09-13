import style from "./Editor_ActionArea.css";
import DateTimeSelector from "./DateTimeSelector.js";
import {connect} from"react-redux";
import {mapStateToProps_Logical,setAction_Logical} from "./store.js";
import React from 'react';
import 'core-js/modules/es.object.assign';

class Editor_ActionArea extends React.Component{
	constructor(props){
		super(props);
		this.state={
			actionType:"buy",
			performType:"immediately",
			size:"1",
			price:{	select:"current price",
					type:"number",
					number:"0",
					percentage:"0"
					},
			validUntil:{select:"manual cancel",period:"0",unit:"minute",datetime:"2019-04-30T17:58:30.300"},
			stopLoss:{select:"fixed",
						type:"number",
						number:"0",
						percentage:"0"
			
					},
			stopWin:{select:"fixed",
						type:"number",
						number:"0",
						percentage:"0"
					},
		};
		this.units=["second","minute","hour","day","week","month"];
		this.priceItems=["current price","on top"];
		this.priceLabel=["on top of current price by number","on top of current price by percentage"];
		this.validUntilItems=["manual cancel","period","datetime"];
		this.stopItems=["fixed","dynamic"];
		this.stopLabel=["distance by number","distance by percentage"];
		this.inputText="";
	}

	componentDidUpdate(prevProps){
		let action=this.props.conFile[parseInt(this.props.activeID)?this.props.activeID:this.props.activeID.slice(3)].action;
		if(action!==this.inputText){
			this.inputText=action;
			this.setIniState(action);
		}
	}

	getDefaultState(){
		return {
			actionType:"buy",
			performType:"immediately",
			size:"1",
			price:{	select:"current price",type:"number",number:"0",percentage:"0"},
			validUntil:{select:"manual cancel",period:"0",unit:"minute",datetime:"2019-04-30T17:58:30.300"},
			stopLoss:{select:"fixed",type:"number",number:"0",percentage:"0"},
			stopWin:{select:"fixed",type:"number",number:"0",percentage:"0"},
		};
	}
	getCopyState(){ return JSON.parse(JSON.stringify(this.state)); };

	setIniState(t){
		if(!t||t.startsWith("please"))	this.setState(this.getDefaultState());
		else{
			let tempObj=this.getDefaultState();
			try{
				function groupSet(name,arr)    { if((tempObj[name].select=arr[1])!="current price")	arr[2].includes("%")?tempObj[name][tempObj[name].type="percentage"]=arr[2].slice(0,-1):tempObj[name][tempObj[name].type="number"]=arr[2]; };
				function setRequiredItems(arr) { ["actionType", "performType", "size"].forEach((item,index)=>{ tempObj[item]=arr[index+1] }); }
				function setTradePrice(arr)	   { if(arr) groupSet("price",arr); }
				let      setStop=(name,arr) => { if(arr) arr[1]=="none"?tempObj[name]=this.getDefaultState()[name]:groupSet(name,arr); };

				setRequiredItems( t.match(/(buy|sell),(immediately|specify),(\d+)/) );
				setTradePrice( t.match(/(current price|on top),(\-*\d+%*)*/) );
				["stopLoss" , "stopWin"].forEach(item=>{ setStop(item , t.match(new RegExp(item+':\\((\\w+) (\\-*\\d+\\.*\\d*%*)*\\)'))) });

				let validUntilArray=t.match(/(manual cancel|period|datetime),((\d+ \w+)|(\d+\-\d+\-\d+T\d+:\d+:\d+\.\d+))*/);
				if(validUntilArray){
					let obj=tempObj["validUntil"];
					if((obj.select=validUntilArray[1])=="period")	[obj.period,obj.unit]=validUntilArray[2].split(" ");
					else if(obj.select=="datetime")					obj.datetime=validUntilArray[2];
				}	
				document.getElementById(this.props.activeID).style.color="black";		
			}catch(err){
				console.log(err);
				document.getElementById(this.props.activeID).style.color="red";
			}
			this.setState(tempObj)
		}
	}

	handleSelect=(e)=>{ this.setState({[e.target.id]:e.target.value}); }

	setValue=(e,prop1,prop2)=>{
		let tempObj=prop2?Object.assign({},this.state[prop1]):e.target.value;
		if(prop2) tempObj[prop2]=e.target.value;
		this.setState({[prop1]:tempObj});
	}

	handleInsert=(e)=>{
		e.preventDefault();
		if(isNaN(Number(this.state.size))||Number(this.state.size)===0) 	document.getElementById("size").focus();
		else{
			let tt=this.state.actionType+","+this.state.performType+","+this.state.size;
			if(this.state.performType!=="immediately"){
				tt+=(","+this.state.price.select+this.state.price.select!=="current price"?","+this.getInsertValue(this.state.price):"");
				tt+=","+this.state.validUntil.select+ this.state.validUntil.select=="period"?(","+this.state.validUntil.period+" "+this.state.validUntil.unit):this.state.validUntil.select=="datetime"?","+this.state.validUntil.datetime:"";
			}
			["stopLoss","stopWin"].forEach(item=>{ Number(this.state[item][this.state[item].type])==0? tt+=","+item+":(none)" : tt+=","+item+":("+this.state[item].select+" "+this.getInsertValue(this.state[item])+")"; });

			this.props.setAction_Logical(this.props.activeID,tt.replace(/undefined/g,"").replace(/,+/g,","));
		}
	}

	getInsertValue(v){
		return v[v.type]+(v.type==="number"?"":"%");
	}

	render(){
		return(
			<fieldset  id="Editor_ActionArea" className={style.fieldset}>
				<div className={style.div1}>
					<MySelect	id="actionType"  class={style.actionSelect}	value={this.state.actionType}  setValue={(e)=>this.setValue(e,"actionType")}	items={["buy","sell"]}/>
					<MySelect	id="performType" class={style.actionSelect}	value={this.state.performType} setValue={(e)=>this.setValue(e,"performType")}	items={["immediately","specify"]}/>
					<span className={style.actionSpan}>size:</span>
					<input id="size" className={style.valueInput} type="number" min="0" step="0.01" value={this.state.size} onChange={(e)=>this.setValue(e,"size")}/>
					<button className={style.save} onClick={this.handleInsert}>{" Save "}</button>
				</div>
				<div className={style.priceDiv}>
					<SelectRadioGroup	id="price" class={style.srgSelect} title="price" disabled={this.state.performType==="immediately"}	spanClass={style.priceSpan} value={this.state.price} setValue={this.setValue}	items={this.priceItems} label={this.priceLabel}/>
				</div>

				<fieldset className={style.validUntilFieldSet} disabled={this.state.performType==="immediately"}>
					<div className={style.validUntilInnerDiv1}>
						<span className={style.actionSpan+" "+style.validUntilSpan}>valid until</span>
						<MySelect	id="validUntil-select" class={style.actionSelect} value={this.state.validUntil.select} setValue={(e)=>this.setValue(e,"validUntil","select")}	items={this.validUntilItems}/>
					</div>
					<div className={style.validUntilInnerDiv2}>
						<input id={"validUntil-period"} className={style.valueInput+" "+style.validUntilInput} disabled={this.state.validUntil.select!=="period"} value={this.state.validUntil.period} onChange={(e)=>this.setValue(e,"validUntil","period")} type="number" min="0" step="0.1"/>
						<MySelect	id="validUntil-unit" class={style.actionSelect}   disabled={this.state.validUntil.select!=="period"} value={this.state.validUntil.unit} setValue={(e)=>this.setValue(e,"validUntil","unit")}	items={this.units}/>
						<DateTimeSelector value={this.state.validUntil.datetime} disabled={this.state.validUntil.select!=="datetime"} setValue={(e)=>this.setValue(e,"validUntil","datetime")}/>
					</div>
				</fieldset>

				<div className={style.firstSelectRadioGroupDiv}>
					<SelectRadioGroup id="stopLoss" class={style.srgSelect} title="STOP LOSS"	value={this.state.stopLoss} disabled={false} setValue={this.setValue} items={this.stopItems} label={this.stopLabel}/>
				</div>
				<SelectRadioGroup id="stopWin" 	class={style.srgSelect} title="SWOP WIN"	value={this.state.stopWin} 	disabled={false} setValue={this.setValue} items={this.stopItems} label={this.stopLabel}/>
			</fieldset>
		)
	}
	
}

function SelectRadioGroup(props){
	var bound={
			number:{	
					min:props.value.minNumber===undefined?Number.NEGATIVE_INFINITY:props.value.minNumber,
					max:props.value.maxNumber===undefined?Number.MAX_VALUE:props.value.maxNumber
					},
			percentage:{
					min:props.value.minPercentage===undefined?-100:props.value.minNumber,
					max:props.value.maxPercentage===undefined?100:props.value.maxNumber,
			}
		};

	function handleBlur(e,prop){
		let v=Number(e.target.value)?Number(e.target.value):0;
		e.target.value=(v<bound[prop].min?bound[prop].min:v>bound[prop].max?bound[prop].max:v).toString();
		props.setValue(e,props.id,prop);
	}

	return(
			<fieldset className={style.RadioGroupFieldSet}	disabled={props.disabled}>
				<span className={style.actionSpan+" "+style.SelectRadioGroupSpan+" "+props.spanClass}>{props.title}</span>
				<MySelect id={props.id+"-select"} class={props.class} disabled={props.disabled} value={props.value.select} setValue={(e)=>props.setValue(e,props.id,"select")} items={props.items}/>
			
				<div className={style.SelectRadioGroupRadioDiv}>
					<input id={props.id+"-type-number"} 	type="radio" name={props.id} 	disabled={props.value.select=="current price"}	value="number" 		checked={props.value.type=="number"}	onChange={(e)=>props.setValue(e,props.id,"type")}	/>{props.label[0]}<br/>
					<input id={props.id+"-type-percentage"} type="radio" name={props.id} 	disabled={props.value.select=="current price"}	value="percentage" 	checked={props.value.type!="number"}	onChange={(e)=>props.setValue(e,props.id,"type")}	/>{props.label[1]}
				</div>
				<div className={style.SelectRadioGroupInputDiv}>
					<input id={props.id+"-number"} 		disabled={props.value.type!="number"||props.value.select=="current price"}	className={style.valueInput+" "+style.RadioGroupInput}	type="number" 	step="0.001" value={props.value.number}  	onChange={(e)=>props.setValue(e,props.id,"number")} onBlur={(e)=>handleBlur(e,"number")}	/><br/>
					<input id={props.id+"-percentage"} 	disabled={props.value.type=="number"||props.value.select=="current price"} 	className={style.valueInput+" "+style.RadioGroupInput} type="number" 	step="0.1"   value={props.value.percentage} onChange={(e)=>props.setValue(e,props.id,"percentage")} onBlur={(e)=>handleBlur(e,"percentage")}	/>
				</div>
			</fieldset>
	);
}

function MySelect(props){
	return(
		<select id={props.id}	className={props.class} disabled={props.disabled}	value={props.value}	onChange={(e)=>props.setValue(e)}>
			{props.items.map((item)=><option key={props.id+"-"+item}	value={item}>{item}</option>)}
		</select>
	);
}

export default connect(mapStateToProps_Logical,{setAction_Logical})(Editor_ActionArea);
