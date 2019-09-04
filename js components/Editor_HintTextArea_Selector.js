import style from "./Editor_HintTextArea_Selector.css"
import React from 'react';
import ReactDOM from 'react-dom';
export default class Editor_HintTextArea_Selector extends React.Component{
	constructor(props){
		super(props);
		this.state={
			priceSelect:"c",
			periodSelect:"t",
			shiftType:"number",
			shiftChecked:true,		
			flexRangeLow:0,
			flexRangeUp:0,
			rangeUnit:'s',
			unitHidden:true,
			unitSelect:"s",
		}
		this.periodC={"t":"tick","m1":"1 minute","m2":"2 minutes","m3":"3 minutes","m4":"4 minutes","m5":"5 minutes","m6":"6 minutes","m10":"10 minutes","m15":"15 minutes",
		"m20":"20 minutes","m30":"30 minutes","h1":"1 hour","h2":"2 hours","h4":"4 hours","d1":"1 day","w1":"1 week","M1":"1 month","y1":"1 year"};

		this.insert=">insert<";
		
	}


	handleChecked=(e)=>{
		if(e.target.value==="number"&&e.target.checked){
			this.setState({shiftType:"number",shiftChecked:true,unitHidden:true});
		}
		else{
			this.setState({shiftType:"time",shiftChecked:false,unitHidden:false});
		}
	}

	handleSelect=(e)=>{
		this.setState({[e.target.name]:e.target.value});
		if(e.target.name==="periodSelect"){
			if(e.target.value==="t") 	this.setState({unitSelect:"s"});
			else						this.setState({unitSelect:e.target.value.charAt(0)});
		}

	}

	handleIndexShift=(e)=>{
		let value=Number(e.target.value);
		this.setState({[e.target.name]:value});
		
		if(e.target.name==="flexRangeLow"&&value>this.state.flexRangeUp)	
			this.setState({flexRangeUp:value});			
		
		else if(e.target.name==="flexRangeUp"&&value<this.state.flexRangeLow)
			this.setState({flexRangeLow:value});	
	}

	handleValueSubmit = (e)=>{
		e.preventDefault();
		this.props.updateInput("v("+this.state.priceSelect+","+this.state.periodSelect+","+this.state.flexRangeLow+","+this.state.flexRangeUp+","+this.state.unitSelect+")");
	}

	priceSelector(){
		let priceC={"c":"close price","o":"open price","h":"high price","l":"low price","v":"volumn","p":"current price"};
		let s={
				float:"left"
		}
		return(
			<select name="priceSelect" style={s} value={this.state.priceSelect} onChange={this.handleSelect}>
				{Object.keys(priceC).map((item)=>
					<option key={item} value={item}>{priceC[item]}</option>
				)}
			</select>
		
		);
	}
	
	periodSelector(){
		let s={
				float:"left"
		}
		return(
			<select name="periodSelect" style={s} value={this.state.periodSelect} onChange={this.handleSelect}>
				{Object.keys(this.periodC).map((item)=>
					<option key={item} value={item}>{this.periodC[item]}</option>
				)}
			</select>		
		);
	}

	indexSelector(){
		let s={
				float:"left",
				marginLeft:"8px"
		}
		let numberStyle={
			width:"90px",
			margin:"10px"
		}
		return(
				<fieldset style={s}>
				<legend>Choose Target Index</legend>
					<div style={s}>
						<input type="radio" name="baseIndex" 	value="s" style={s}/>signal<br/>
						<input type="radio" name="baseIndex" 	value="c" style={s}/>current
					</div>
					<div style={s}>
						<input type="checkbox"/>full candle available
					</div>
					<div style={s}>	
						<input type="radio" name="shiftIndex" 	value="number" checked={this.state.shiftChecked} onChange={this.handleChecked}/>number of ticks(candles)<br/>
						<input type="radio" name="shiftIndex"	value="time" checked={!this.state.shiftChecked} onChange={this.handleChecked}/>time drift
					</div>
					{this.indexRangeSelector()} 
				</fieldset>
		)
	}

	indexRangeSelector(){
		let s={
				float:"left",
				marginLeft:"8px"
		}
		let numberStyle={
			width:"90px",
			margin:"10px"
		}
		
		var options=(		
				<select name="unitSelect" hidden={this.state.unitHidden} value={this.state.unitSelect} onChange={this.handleSelect}>
					
					<option value="s" hidden={this.state.periodSelect!="t"}>s</option>
					<option value="ms" hidden={this.state.periodSelect!="t"}>ms</option>
					
					<option value={this.state.periodSelect.charAt(0)} hidden={this.state.periodSelect==="t"}>{this.state.periodSelect.charAt(0)}</option>
				
				</select>
		);
		
		

		return(
			<div style={s}>
				<input style={numberStyle} type="number" name="flexRangeLow" step="1" value={this.state.flexRangeLow} onChange={this.handleIndexShift}/>--
				<input style={numberStyle} type="number" name="flexRangeUp"  step="1" value={this.state.flexRangeUp}  onChange={this.handleIndexShift}/>
				{options}
				
			</div>

		)
	}

	selector(){
		return(	
				<fieldset className={style.logicalAreaUl} id="selectorFieldset">
					<legend >Selector</legend>				
					{this.priceSelector()}
					{this.periodSelector()}		
					{this.indexSelector()}	
					<button className={style.Editor_HintTextAreaButton} onClick={this.handleValueSubmit}> {this.insert} </button>
				</fieldset>
		);
	}


	render(){
		return(
			<form>
			{this.selector()}
			</form>
			
		)
	}
}