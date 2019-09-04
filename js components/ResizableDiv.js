import Editor from "./Editor.js";
import Analyse from "./Analyse.js";
import style from "./ResizableDiv.css";
import Explorer from "./Explorer.js";
import React from 'react';
import Echart from "./Echart.js";
import {myChart} from "./Echart.js";
import Result from "./Result.js";
import Console from "./Console.js";

export default function ResizableDiv(props){
	var draging=false;
	var dragStartX=0;
	var dragBarLeft=0;
	var dragBarWidth=0;
	var p="";
	var n="";
	var cdrag="";
	var ndrag="";
	var pWidth=0;
	var nextDragBarLeft=0;

	var handleMouseMove=(e)=>{
		if(draging){
			p.outerWidth(pWidth+e.clientX-dragStartX);
			cdrag.offset({left:dragBarLeft+e.clientX-dragStartX});
			n.offset({left:dragBarLeft+e.clientX-dragStartX+dragBarWidth});
			n.outerWidth(nextDragBarLeft-(dragBarLeft+e.clientX-dragStartX+dragBarWidth));
			
		}
	}

	var handleMouseDown=(e)=>{
		//e.preventDefault();
		cdrag=$("#"+e.target.id);
		p=cdrag.prev();
		n=cdrag.next();
		ndrag=n.next();


		dragStartX=e.clientX;
		dragBarLeft=cdrag.offset().left;
		dragBarWidth=cdrag.outerWidth();
		pWidth=p.outerWidth();

		nextDragBarLeft=ndrag.length===0?document.documentElement.clientWidth-1:ndrag.offset().left;	
		draging=true;
	}

	var handleMouseUp=(e)=>{
		draging=false;
	}

	var handleButton=(e)=>{
		["analyse","editor"].map((item)=>{
			if(item===e.target.id.match(/(.*)SwitchButton/)[1])	$("#"+item+"Div").show();
			else $("#"+item+"Div").hide();
		})
	}



	return (<div className={style.outerDiv} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} >
				<div id="rdiv1" className={style.rdiv1}>
					<Explorer />
				</div>
				<a id="dragbar1" className={style.dragbar1}	onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}/>
				<div id="rdiv2" className={style.rdiv2}>
					<button id="analyseSwitchButton" onClick={handleButton}>Analyse</button>
					<button id="editorSwitchButton" onClick={handleButton}>Backtest</button>					
					<Editor />
					<Analyse />
				</div>
				<a id="dragbar2" className={style.dragbar2} onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}/>
				<div id="rdiv3" className={style.rdiv3}>
					<Echart />
					<Console />
					<Result />
				</div>
			</div>
	);
}

var getWidth=function(id){
	return document.getElementById(id).getBoundingClientRect().width;
}
var setPosition=function(value){
	let names=		["rdiv1","dragbar1","rdiv2","rdiv2","dragbar2","rdiv3","rdiv3"];
	let properties=	["width","left",	"left", "width","left",    "left", "width"];
	names.forEach((item,index)=>{
		document.getElementById(item).style[properties[index]]=value[index]+"px";
	})
}

window.onresize=()=>{
	var cliWidth=document.documentElement.clientWidth-1;//$("body").prop("clientWidth");
	var dragWidth=getWidth("dragbar1");
	var width1=getWidth("rdiv1");
	var width2=getWidth("rdiv2");			
	var width3=getWidth("rdiv3");
	var preWidth=width1+width2+width3+dragWidth*2;
	width1=Math.floor(width1/preWidth*cliWidth);
	width2=Math.floor(width2/preWidth*cliWidth);
	width3=cliWidth-width1-width2-2*dragWidth;
	var dragBar1Left=width1;
	var left2=dragBar1Left+dragWidth;
	var dragBar2Left=left2+width2;
	var left3=dragBar2Left+dragWidth;
	setPosition([width1,dragBar1Left,left2,width2,dragBar2Left,left3,width3]);
	myChart.resize();
}



window.onload=()=>{
	var cliWidth=document.documentElement.clientWidth-1;
	var width1=Math.floor(cliWidth*0.2);
	var dragBar1Left=width1;
	var left2=dragBar1Left+getWidth("dragbar1");
	var width2=Math.floor(cliWidth*0.45);
	var dragBar2Left=left2+width2;
	var left3=dragBar2Left+getWidth("dragbar2");
	var width3=cliWidth-left3;
	setPosition([width1,dragBar1Left,left2,width2,dragBar2Left,left3,width3]);
	myChart.resize();
}


var browserType="";
if (/*@cc_on!@*/false || !!document.documentMode) browserType="IE";
else if(browserType!=="IE"&&!!window.StyleMedia) browserType="Edge";
else if (typeof InstallTrigger !== 'undefined') browserType="Firefox";
else if (window.MessageEvent && !document.getBoxObjectFor) browserType="Chrome";
else if ((!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0) browserType="Opera";
else if (/constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification))) browserType="Safari";

console.log("browserType="+browserType);
