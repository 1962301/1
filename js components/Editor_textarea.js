import React from "react";
import {connect, Provider} from "react-redux";
import {mapStateToProps_Logical,setCondition_Logical} from "./store.js";
import style from "./Editor_textarea.css";

class Editor_textarea extends React.Component{
		constructor(props){
			super(props);
			this.fontWidth=0;
			this.state={
				selection:{
					start:0,
					end:0
				},
				tips:[],
				tipSelected:0,
			}
			this.blur=false;
			this.functionName=["aaaa","aabb","baab","abba","bbaa","aaac","bbbc","ddac","aabd","bbac","3eesdaasfdc","asdihgjkcbjyweeg"];
		}

		componentDidMount(){
			this.pRef=document.getElementById("pRef");
			let a=(s)=>{
				this.pRef.value=s;
				return this.pRef.scrollWidth;
			}
			this.fontWidth=a("AA")-a("A");
			this.textarea=document.getElementById("textarea");
			this.tips=document.getElementById("tips");
			this.tipList=document.getElementById("tipList");
		}

		onChange=(e)=>{
			this.props.setCondition_Logical(this.props.activeID,e.target.value);
			this.setupTips(e);
		}
		setupTips=(e)=>{
			this.setTipsVisibility(false);
			if(e.target.selectionStart==e.target.selectionEnd){
				let match=e.target.value.slice(0,e.target.selectionStart).match(/[a-z]+\w*$/i);
				let followLetter=e.target.value.slice(e.target.selectionStart).match(/^\w+/i);

				if(match&&!followLetter){
					let tipsList=this.functionName.filter(item=>!!item.match(match[0])).sort( (c,d) => c.indexOf(match[0])-d.indexOf(match[0])||(c>d?1:-1) );
					if(tipsList.length!=0&&tipsList[0]!=match[0]){	
						this.setTipsVisibility(true);
						this.setState({tips:tipsList});
						this.setTipsPosition(e.target.value.slice(0,e.target.selectionStart));
					}
				}
			}
		}
		setTipsPosition(value){
			this.pRef.value=value;
			let style=window.getComputedStyle(this.textarea);
			let letterPerRow=Math.floor(this.textarea.getBoundingClientRect().width/this.fontWidth);
			let left=(this.pRef.value.length%letterPerRow)*this.fontWidth;
			let row=Math.floor(this.pRef.value.length/letterPerRow);

			if(!left&&row) {
				row--;
				left=letterPerRow*this.fontWidth;
			}					
			this.tips.style.left=(3+parseInt(style.left)+left)+"px";
			this.tips.style.top=(parseInt(style.top)+(row+0.5)*parseInt(style.lineHeight))+"px";
		}
		setTipsVisibility(boolean){
			if(!boolean) this.setState({tipSelected:"0"});
			this.tips.style.visibility=boolean?"visible":"hidden";
		}
		keyDown=(e)=>{
			if((e.keyCode===40||e.keyCode===38)&&(this.tips.style.visibility=="visible")){
				e.preventDefault();
				let index=this.state.tipSelected+e.keyCode-39<0?0:this.state.tipSelected+e.keyCode-39>=this.state.tips.length?this.state.tips.length-1:this.state.tipSelected+e.keyCode-39;
				let liH=(index+((e.keyCode-39)>0?1:0))*parseInt(window.getComputedStyle(document.getElementById("li0")).height); 
				let ulH=parseInt(window.getComputedStyle(this.tips).height);

				if     (this.tips.scrollTop<liH-ulH) this.tips.scrollTop=liH-ulH;
				else if(this.tips.scrollTop>liH)	 this.tips.scrollTop=liH;
				this.setState({tipSelected:index});		
			}
			else if(e.keyCode===9||e.keyCode===13||e.keyCode===32){	//tab enter space
				e.preventDefault();
				if(this.tips.style.visibility=="visible") this.insertTip(e.target);		
			}
		}
		keyUp=(e)=>{
			if((e.keyCode!=40&&e.keyCode!=38&&e.keyCode!=9&&e.keyCode!=13&e.keyCode!=32)||(this.tips.style.visibility!="visible")) this.setupTips(e);
		}

		onBlur=(e)=>{
			this.blur=true;
			this.setTipsVisibility(false);
			this.setState({selection:{start:e.target.selectionStart,end:e.target.selectionEnd}});
		}
		click=(e)=>{
			if(this.blur) [e.target.selectionStart,e.target.selectionEnd, this.blur]=[this.state.selection.start,this.state.selection.end, false];
			this.setupTips(e);
		}
		tipsMouseDown=(e)=>{
			e.preventDefault();
			let index=this.state.tips.indexOf(e.target.innerText.trim());
			if(index!=-1) this.state.tipSelected==index?this.insertTip():this.setState({tipSelected:index});
		}
		insertTip(){
			let firstHalfValue=this.textarea.value.slice(0,this.textarea.selectionStart).replace(/[a-z]+\w*$/i,this.state.tips[this.state.tipSelected]);
			this.props.setCondition_Logical(this.props.activeID,this.textarea.value=firstHalfValue+this.textarea.value.slice(this.textarea.selectionStart));
			this.textarea.selectionStart=this.textarea.selectionEnd=firstHalfValue.length;
			this.setTipsVisibility(false);
		}
		insertCandle=(value)=>{
			this.props.setCondition_Logical(this.props.activeID,this.textarea.value.slice(0,this.textarea.selectionStart)+value+this.textarea.value.slice(this.textarea.selectionEnd));
			this.textarea.focus();
		}

		getCondition(){
			return this.props.conFile[parseInt(this.props.activeID)?this.props.activeID:this.props.activeID.slice(3)].condition;
		}

		render(){
			console.log(this.props);


			return(
				<div id="Editor_textarea" className={style.div}>
					<textarea id="textarea" className={style.textarea} value={this.getCondition()} onChange={this.onChange} onKeyUp={this.keyUp} onKeyDown={this.keyDown} onClick={this.click} onBlur={this.onBlur}/>
					<textarea id="pRef"className={style.textarea+" "+style.hiddenTextArea}/>
					<ul id="tips" className={style.ul}>
						{this.state.tips.map((item,index)=><li key={index} id={"li"+index} className={style.li+" "+(this.state.tipSelected==index?style.liSelected:"")} onMouseDown={this.tipsMouseDown}> {item} </li>)}
					</ul>
					<CandleSelector insertCandle={this.insertCandle} />
				</div>
			);
		}
	};

	function CandleSelector(props){
		/*
		let period={"t":"tick","m1":"1 minute","m2":"2 minutes","m3":"3 minutes","m4":"4 minutes","m5":"5 minutes","m6":"6 minutes","m10":"10 minutes","m15":"15 minutes",
		"m20":"20 minutes","m30":"30 minutes","h1":"1 hour","h2":"2 hours","h4":"4 hours","d1":"1 day","w1":"1 week","M1":"1 month","y1":"1 year"};
		*/
		let price={
			"clo":"clo:close price",
			"o":"o:open price",
			"h":"h:high price",
			"low":"low:low price",
			"vol":"vol:volumn",
			"col":"col:color",
			"DT":"DT:DateTime",
			"HLM":"HLM:Mid between High and Low",
			"OCM":"OCM:Mid between Open and Close",
			"BH":"BH:Body High",
			"BL":"BL:Body Low",
			"OEC":"OEC:Open=Close?",
			"OBC":"OBC:Open>Close?",
			"CBO":"CBO:Close>Open?"
		};




		let units={"s":"second","m":"minute","h":"hour","d":"day","ms":"millisecond"};

		function el(id) { return document.getElementById(id) }
		function getSelector(id,obj,className){
			return  <select id={id} className={style[className]}>
						{Object.keys(obj).map(item=><option key={className+item} value={item}>{obj[item]}</option>)}
					</select>
		}
		function radioChange(e){
			if(el("timeRangeChecker").checked) el("unit").style.visibility="visible";
			else el("unit").style.visibility="hidden";
		}
		function rangeBlur(e){
			let match=e.target.value.match(/\-*\d+/);
			let a=(v)=>{
				el("reason").innerText=v; 
				el("reason").style.visibility="visible"; 
				e.target.focus();
			}
			if(!match||match[0]!=e.target.value) 	a("please entre an integer")
			else if(Number(el("lowBound").value)>Number(el("highBound").value)) a("low bound should be smaller or equal to highBound")
		}
		function rangeChange() { el("reason").style.visibility="hidden"; }

		function click(){
			if(el("reason").innerText==""||el("reason").style.visibility=="hidden"){
				let value="v("+	 el("priceSelector").value+","+
								 el("lowBound").value+","+el("highBound").value+
								(el("unit").style.visibility=="visible"?","+el("unit").value:"")+")";
				props.insertCandle(value);
			}
		}

		return(
			<fieldset id="candleSelector" className={style.candleFieldSet}>
			<legend>Choose Target Index</legend>
				{getSelector("priceSelector",price,"select")}			
				<div className={style.inlineDiv}>	
					<input defaultChecked  		 type="radio" name="shiftIndex" value="n"  onChange={radioChange}/>number of ticks(candles)<br/>
					<input id="timeRangeChecker" type="radio" name="shiftIndex"	value="t"  onChange={radioChange}/>time drift
				</div>
				<div className={style.inlineDiv}>
					{"Range:  "}
					<input id="lowBound"  type="number" className={style.input} step="1"  defaultValue="0" onBlur={rangeBlur} onChange={rangeChange}/>--
					<input id="highBound" type="number" className={style.input} step="1"  defaultValue="0" onBlur={rangeBlur} onChange={rangeChange}/>
				</div>

				{getSelector("unit",units,"unit")}
			<div>
				<button className={style.button} onClick={click}>insert</button>
				<span id="reason" className={style.reason}></span>
			</div>
			</fieldset>
		);

	}

	export default connect(mapStateToProps_Logical,{setCondition_Logical})(Editor_textarea);