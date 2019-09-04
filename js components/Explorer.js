import style from "./Explorer.css";
import React from 'react';
import {connect} from 'react-redux';
import {mapStateToProps_Explorer,setConFile_Explorer,setData_Echart,setConFileName_Logical,setFileSys_Explorer,file,addInfo} from "./store.js";
import {ajaxSend,pathToJSON,getEchartOption,formatData,getPathArrFromFileSysArr} from "./Func.js";

class Explorer extends React.Component{
	constructor(props){
		super(props);
		this.selectNode=null;	//the node when right click mouse
		this.updateDBInfo={};
		this.isCreate=false;
		this.focusID="";
	}

	componentDidMount(){
		this.contextMenu=document.getElementById("ContextMenuDiv");
	}

	componentDidUpdate(){
		if(this.isCreate){
			this.isCreate=false;
			this.rename(document.getElementById(this.focusID),true);
		}

	}

	analyseSYS(obj,path){
		let a=Object.keys(obj).reduce((t,key)=>{
			if(obj[key]=="file") t.push(<li id={path+key} key={path+key} title="file, double click to open" onDoubleClick={this.openFile} onContextMenu={this.onContextMenu}><img src="./imgs/page.gif" className={style.gif}/><span style={{padding:"0 5px 0 5px"}} onKeyDown={this.spanKeyDown}>{key}</span></li>);
			else{
				t.push(<li id={path+key} key={path+key} onClick={this.folderClick} title="folder" onContextMenu={this.onContextMenu}><div className={style.rightArrow}/><img src="./imgs/folder.gif" className={style.gif}/><span style={{padding:"0 5px 0 5px"}} onKeyDown={this.spanKeyDown}>{key}</span></li>);
				if(obj[key]!="folder") t.push(this.analyseSYS(obj[key],path+key+"/"));
			}
			return t;
		},[]);
		return <ul key={path+"-ul"} style={{display:path?"none":"block"}}>{a}</ul>;
	}
	spanKeyDown(e){
		if(e.keyCode==13){	e.preventDefault();
							e.target.blur();
		}
	}

	showContextMenu(){
		this.contextMenu.style.visibility="visible";
		this.contextMenu.focus();
	}

	folderClick=(e)=>{
		e.stopPropagation();
		e.currentTarget.firstChild.classList.toggle(style.arrowDown);
		var a=e.currentTarget.nextSibling;
		if(a&&a.nodeName=="UL"){
			a.style.display=(a.style.display=="none"?"block":"none");
		}
		
	}
	openFile=(e)=>{
		let fileName=e.currentTarget.id;

		if(fileName.endsWith(".data")&&fileName!=this.props.dataFileName){	
			this.props.addInfo([{type:"normal",info:"loading..."}]);
			ajaxSend(	"POST","/getData",
						(response)=>{this.props.setData_Echart(fileName,formatData(response),getEchartOption(0,100,[]))},
						JSON.stringify({"fileName":fileName,offset:0})
			);
		}
		else if(fileName.endsWith(".str")&&fileName!=this.props.conFileName){
			this.props.addInfo([{type:"normal",info:"reading file..."}]);
			ajaxSend(	"POST","/getStrategyFile",
						(response)=>{
							if(response.error!=undefined)	this.props.setConFile_Explorer(fileName,file);
							else this.props.setConFile_Explorer(fileName,response)
						},
						JSON.stringify({"fileName":fileName})
			);
		}
	}

	onContextMenu=(e)=>{
		if(!e.currentTarget.id.match(/^Example/)&&e.currentTarget.id!=this.props.userName&&e.currentTarget.id!=this.props.userName+"/Strategy"&&e.currentTarget.id!=this.props.userName+"/Data"){
			this.selectNode=e.currentTarget;
			this.showContextMenu();
			let refRect=document.getElementById("filesDiv").getBoundingClientRect();
			let contextRect=this.contextMenu.getBoundingClientRect();
			let [left,top]=[e.clientX,e.clientY];
			this.contextMenu.style.top=((top+contextRect.height)>window.innerHeight?(top-contextRect.height):top)+"px";
			this.contextMenu.style.left=((left+contextRect.width)>refRect.right?(left-contextRect.width):left)+"px";
		}
	}

	assignFunction=(f)=>{
		if(f=="new folder") 			this.createNewDir("folder","NewFolder","");
		else if(f=="new data file") 	this.createNewDir("file","NewFile",".data");
		else if(f=="new strategy file")	this.createNewDir("file","NewFile",".str");
		else if(f=="delete")  			this.delete();
		else if(f=="rename")  			this.rename(this.selectNode,false);
	}

	createNewDir(type,name,postfix){
		this.isCreate=true;

		let path=this.selectNode.value=="file"?this.selectNode.id.slice(0,this.selectNode.lastIndexOf("/")):this.selectNode.id;
		let fullPath=this.getValidFullPath(path,name,postfix);

		let fileSysArr=this.props.fileSysArr.slice().filter(obj=>{
			return obj.type=="file"||!fullPath.startsWith(obj.frontfile);
		});
		fileSysArr.push({frontfile:fullPath,type:type});
		this.focusID=fullPath;
		this.props.setFileSys_Explorer(fileSysArr);
	}

	updateFileSys(obj){
		ajaxSend("POST","/updateFileSys",
				(response)=>{this.props.setFileSys_Explorer(response)},
				JSON.stringify(obj)
		);
	}

	delete(){
		if(confirm("You are attempting to DELETE "+this.selectNode.id+". Do you wish to continue"))	this.updateFileSys({action:"delete",path:this.selectNode.id});
	}

	getValidFullPath(path,name,postfix){
		let fullPath=path+"/"+name+postfix, i=0;
		let pathArr=getPathArrFromFileSysArr(this.props.fileSysArr);
		while(pathArr.some(item=>item.startsWith(fullPath)))	{	fullPath=path+"/"+name+"_"+(++i)+postfix;	}
		return fullPath;
	}

	rename(el,forCreating){
		el.parentElement.style.display="block";
		this.setSpanOnFocus(el.lastChild);

		var spanOnBlur=(e)=>{
			e.target.contentEditable=false;

			let newName=e.target.innerText;
			let path=el.id.slice(0,el.id.lastIndexOf("/"));
			let newFullPath=path+"/"+newName;

			if(newFullPath==el.id){ 
				e.target.removeEventListener("blur",spanOnBlur);
				if(forCreating)	this.updateFileSys({action:"create",path:el.id}); 			
			}
			else if(!newName.match(/^[a-zA-Z]\w*\.*\w*/)||newName!=newName.match(/^[a-zA-Z]\w*\.*\w*/)[0]){
				this.setSpanOnFocus(el.lastChild);
				//add info massage;
			}
			else if(el.title.includes("folder")){
				if(newName.match(/\.data$|\.str$/))	this.setSpanOnFocus(el.lastChild);
				else if(newFullPath!=this.getValidFullPath(path,newName,"")) this.setSpanOnFocus(el.lastChild);
				else{
					e.target.removeEventListener("blur",spanOnBlur);
					this.updateFileSys(forCreating?{action:"create",path:newFullPath}:{action:"rename",originalPath:el.id,newPath:newFullPath}); 
				}
				//add info massage;
			}
			else if(el.title.includes("file")){
				if(!newName.includes(".")) this.setSpanOnFocus(el.lastChild);
				else if(!newName.endsWith(el.id.slice(el.id.lastIndexOf(".")))) this.setSpanOnFocus(el.lastChild);
				else if(newFullPath!=this.getValidFullPath(path,newName.slice(0,newName.lastIndexOf(".")),newName.slice(newName.lastIndexOf(".")))) this.setSpanOnFocus(el.lastChild);
				else{
					e.target.removeEventListener("blur",spanOnBlur);
					this.updateFileSys(forCreating?{action:"create",path:newFullPath}:{action:"rename",originalPath:el.id,newPath:newFullPath}); 
				}
				//add info massage;
			}
		}

		el.lastChild.addEventListener("blur",spanOnBlur);
	}

	setSpanOnFocus(el){
		el.contentEditable=true;
		el.spellcheck=false;
		el.autocomplete=false;			
		el.focus();
	}
	

	getNewFolder(path){
		return <li id={path+"@new"} onClick={this.folderClick} title="folder"><div className={style.rightArrow}/><img src="./imgs/folder.gif" className={style.gif}/><input className={style.nameInput} defaultValue="new folder"/></li>
	}

	render(){
		return(
		<div id="filesDiv" className={style.filesDiv} onContextMenu={e=>e.preventDefault()}>
			{this.analyseSYS(this.props.fileSys,"")}
			<ContextMenu action={this.assignFunction}/>
		</div>
		);
	};

};

function ContextMenu(props){
	var click=function(e){
		document.getElementById("ContextMenuDiv").style.visibility="hidden";
		props.action(e.target.childNodes[0].nodeValue);
	}
	var blur=function(e){
		document.getElementById("ContextMenuDiv").style.visibility="hidden";
	}
	return(
		<div id="ContextMenuDiv" tabIndex="-1" className={style.ContextMenuDiv} onClick={click} onBlur={blur}>
		<ul className={style.ContextMenuUl}>
			{["new folder","new data file","new strategy file","delete","rename"].map(item=><li className={style.ContextMenuLi}>{item}</li>)}
		</ul>
		</div>

	)
}

export default connect(mapStateToProps_Explorer,{setConFile_Explorer,setData_Echart,setConFileName_Logical,setFileSys_Explorer,addInfo})(Explorer);
