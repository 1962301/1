import style from "./Editor_HintTextArea.css"
import Editor_HintTextArea_Selector from "./Editor_HintTextArea_Selector.js";
import React from 'react';

export default class Editor_HintTextArea extends React.Component{
	constructor(props){
		super(props);
		this.state={
			showTips:false,
			functionName:[],
			tipsSelected:0,
			startIndex:0,
			endIndex:0,
			beforeText:[],
			afterText:[]
		};
		this.tipsPosition={
			left:"1",
			top:"2"
		};
		this.textareaRef=React.createRef();
		this.maxLength=400;
		this.blur=false;
		this.text=""
	}

	componentDidUpdate(prevProps){
		if(document.activeElement.id==="textarea"&&!this.blur){
			document.getElementById("textarea").selectionStart=this.state.startIndex;
			document.getElementById("textarea").selectionEnd=this.state.endIndex;
			this.setTipsList();
		}
	}

	setValue(value,startIndex,endIndex){
		if(value.length<=this.maxLength){
			this.props.updateInput(this.setParentContent(value));	
			this.setIndex(value,startIndex,endIndex);
		}
	}

	setIndex(value,startIndex,endIndex){
		this.setState({
			startIndex:startIndex,
			endIndex:endIndex,
			beforeText:this.splitArray(value.slice(0,startIndex)),
			afterText:this.splitArray(value.slice(startIndex))
		});
	}

	splitArray(value){		//in current situation (ban enter and tab and space, don't need this function), this is for next update when the textarea support enter tab and space
		let t=[];
		let temp=value.split(/\r\n|\r|\n/g);
		for(let i=0;i<temp.length;i++){
			t.push(temp[i]);
			if(i!==temp.length-1)	t.push(<br/>);
		}
		return t;	
	}

	getContentFromParent(){
		this.text=this.props.activeContent.slice(this.props.activeContent.indexOf("(")+1,this.props.activeContent.lastIndexOf(")"));
		return this.text;
	}

	setParentContent(value){
		return this.props.activeContent.slice(0,this.props.activeContent.indexOf("(")+1)+value+")";
	}

	handleOnChange= (e) =>{
		this.setValue(e.target.value,e.target.selectionStart,e.target.selectionEnd);
	}

	handleClick=(e)=>{
		if(!this.blur) this.setIndex(e.target.value,e.target.selectionStart,e.target.selectionEnd);
	}

	handleMouseDown=(e)=>{
		if(this.blur){
			e.preventDefault();
			this.blur=false;
			e.target.focus();
		}
	}

	handleKeyPress = (e) =>{
		if(e.keyCode===37||e.keyCode===39)	// left  right
			this.setIndex(e.target.value,e.target.selectionStart,e.target.selectionEnd);
	}

	handleKeyUp = (e) =>{			//give the updated position when press left right arrow
		if(e.keyCode===37||e.keyCode===39||e.keyCode===38||e.keyCode===40){
			this.setIndex(e.target.value,e.target.selectionStart,e.target.selectionEnd);
		}
	}

	handleKeyDown = (e) =>{			//when press arrow, this function only gives the previous position of selectionStart and End, so using keyup to detect left right arrow; and onKeyPress doesn't response to arrow.
		if((e.keyCode>=48&&e.keyCode<=105)||e.shiftKey||(e.keyCode>=37&&e.keyCode<=40)||e.keyCode===46||e.keyCode===8){	
			if(this.state.showTips){
				//down  up
				if((e.keyCode===40||e.keyCode===38)&&(this.state.functionName.length>this.state.tipsSelected+e.keyCode-39)&&(this.state.tipsSelected+e.keyCode-39>=0)){
					e.preventDefault();
					this.tipsScrollControll(this.state.tipsSelected+e.keyCode-39);
					this.setState({tipsSelected:this.state.tipsSelected+e.keyCode-39});
				}
			}
		}
		else{	//tab enter space
			if((e.keyCode===9||e.keyCode===13||e.keyCode===32)&&(this.state.showTips))	this.insertTips(e.target);		
			e.preventDefault()
		}
	}

	tipsScrollControll(index){
		let liHeight=$("#li0").height();
		let ulHeight=$("#tipsUl").height();
		let scrolltop=$("#tipsUl").scrollTop();
		let startIndex=scrolltop/liHeight;
		let endIndex=startIndex+Math.floor(ulHeight/liHeight)-1;

		if(index<startIndex) $("#tipsUl").scrollTop(scrolltop+(index-startIndex)*liHeight);
		else if(index>endIndex)	$("#tipsUl").scrollTop(scrolltop+(index-endIndex)*liHeight);
	}

	handleOnFocus = (e) =>{
		this.blur=false;
	}

	handleOnBlur =(e) =>{
		this.blur=true;
		this.checkSetShowTips(false);
	}


	handleTipsMouseDown = (e) =>{
		e.preventDefault();
		let index=this.state.functionName.indexOf(e.target.innerHTML.trim());
		this.state.tipsSelected===index?this.insertTips(document.getElementById("textarea")):this.setState({tipsSelected:index})
	}

	insertTips(target){		//needs to change when textarea support enter and tab
		let firstHalfValue=target.value.slice(0,target.selectionStart).replace(/[a-z]+\w*$/i,this.state.functionName[this.state.tipsSelected]);
		let newValue=firstHalfValue+target.value.slice(target.selectionStart);
		//******************************need to set cursor to the first parameter of the function**************************
		target.selectionStart=target.selectionEnd=firstHalfValue.length;
		this.setValue(newValue,firstHalfValue.length,firstHalfValue.length);
	}

	

	checkSetShowTips(status){
		if(this.state.showTips!==status) this.setState({showTips:status});
	}

	setTipsList(){
		var t=document.getElementById("cursor");
		if(t!==null){		
			var reg=/[a-z]+\w*$/i;
			var matchStringArr=reg.exec(this.state.beforeText[this.state.beforeText.length-1]);								//get text before cursor if there are some letters(function name)
			var checkFollowLetter=this.state.afterText.length===0?null:this.state.afterText[0].charAt(0).match(/[a-z]/i);	//check text after cursorStart(check if the cursor is in a function name, in this case don't show tips)

			if(checkFollowLetter!==null||matchStringArr===null) 		this.checkSetShowTips(false);
			else{
				let matchString=matchStringArr[0];
				let userInputReg=new RegExp(matchString,"i");
				let filterArr=this.props.functionName.filter((item)=>userInputReg.test(item));

				if(filterArr.length===0)			this.checkSetShowTips(false);
				else{
					filterArr.sort((c,d)=>{
						let dif=c.indexOf(matchString)-d.indexOf(matchString);
						return dif===0?(c>d?1:-1):dif
						}
					);
					if(filterArr[0]===matchString)	this.checkSetShowTips(false);
					
					else if(!this.state.showTips||this.state.functionName.toString()!==filterArr.toString()||this.tipsPosition.top!==t.offsetTop||this.tipsPosition.left!==t.offsetLeft){
						this.tipsPosition.left=t.offsetLeft;
						this.tipsPosition.top=t.offsetTop;
						this.setState({
							showTips:true,
							functionName:filterArr,
							tipsSelected:0
						});
					}

				}
			}
		}
	}

	tipsList(){
		var s0={
			left:(this.tipsPosition.left+10)+"px",
			top:(this.tipsPosition.top+12)+"px",
		}
		
		return(
			<ul id="tipsUl" className={style.tipsUl} style={s0} hidden={!(this.state.showTips)}>
				{this.state.functionName.map((item,index)=><li key={index} id={"li"+index} className={style.tipsLi+" "+(this.state.tipsSelected==index?style.tipsLiSelected:"")} onMouseDown={this.handleTipsMouseDown}> {item} </li>)}
			</ul>
		)
	}

	updateInput= (data)=>{		//used by selector to update insert data
		const node=this.textareaRef.current;
		node.focus();
		let firstHalfValue=this.state.beforeText.join("")+data;
		let newValue=firstHalfValue+this.state.afterText.join("");
		node.selectionStart=node.selectionEnd=firstHalfValue.length;
		this.setValue(newValue,firstHalfValue.length,firstHalfValue.length);
	}



	render(){


		var a1={
			position:"absolute",
			top:"100px",
			left:"10px",
			width:"800px"
		}

		return(
			<fieldset className={style.Editor_HintTextAreaFieldset} id="conFieldSet">
				<textarea className={style.Editor_HintTextAreaTextArea} id="textarea" ref={this.textareaRef} value={this.getContentFromParent()} onChange={this.handleOnChange} onClick={this.handleClick} onMouseDown={this.handleMouseDown} onKeyDown={this.handleKeyDown} onKeyUp={this.handleKeyUp} onFocus={this.handleOnFocus} onBlur={this.handleOnBlur}></textarea>
				<div className={style.Editor_HintTextAreaTextAreaBackDiv}>
					{this.state.beforeText}
					<span id="cursor">|</span>
               		{this.state.afterText}
                </div>
                {this.tipsList()}
                <div style={a1}>
                	<Editor_HintTextArea_Selector updateInput={this.updateInput}/>
                </div>
			</fieldset>
		);
	}

}