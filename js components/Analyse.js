import style from "./Analyse.css";
import React from 'react';
import 'core-js/modules/es.string.ends-with'
//import XLSX from  "xlsx";

"use strict";
export default class Analyse extends React.Component{
	constructor(props){
		super(props);
		if(this.props.data!==null&&this.props.data!==undefined)	this.data=this.props.data;
		else{
			this.data=[];
			//for(let i=0;i<180;i++)	this.data.push([i,i+1,i+2,i+3,i+4,i+5]);
		}

		this.viewTable={
			col:20,
			row:60,
			defW:80,
			defH:20,
			minW:30,
			minH:19,
			defSelectColor:"rgba(224, 224, 224, 0.8)",
			defBGColor:"rgba(0, 0, 0, 0)",
			lastTop:0,
			lastLeft:0
		};
		this.actTable={
			col:20,
			row:60,	
			height:0,
			width:0
		};
		this.rowProps=[];	//each element in this array is an array of [index,specified height, ele top related to table]
		this.colProps=[];	//each element in this array is an array of [index,specified width, ele left related to table]
		this.selectedCells={
			focusCell:{
				id:"",
				row:-1,
				col:-1,
				startOffset:0,
				endOffset:0,
			},
			shift:{
				rowStart:-1,
				rowEnd:-1,
				colStart:-1,
				colEnd:-1,
			},
			ctrl:{},			//key(rows):[cols]
			except:{},			//key(rows):[cols]
		};

		this.tableType={
			rowIndexTable:"rInx",
			colIndexTable:"cInx",
			dataTable:"data"
		};

		this.cursorSensitive=3;

		this.range=document.createRange();

		this.selection=window.getSelection();
		this.preScrollTop=0;
		this.drag={
			enable:false,
			startPosition:0,
			actIndex:0,
			affectElement:[],		//has 3 elements, affected td, indexTR/COL, data table TR/COL
			type:"",
		};
		this.currentRowCol={
			row:0,
			col:0
		}
		this.cellsColor={
			selected:"#E8E8E8",
			copy:"#DCD4D4",
			normal:"white"
		}
		this.copyStatus=false;
	}

	componentDidMount(){
		this.table=document.getElementById("dataTable");
		this.rowTable=document.getElementById("rowIndexTable");
		this.colTable=document.getElementById("colIndexTable");
		this.tableDiv=document.getElementById("tableDiv");
		this.setTableProps();
		this.iniClearTableContent();
		//document.getElementById("dataTable").style.height=this.getTableHeight()+"px";
	}

	getTbody(type){
		let t=[];
		for(let i=0;i<this.viewTable.row;i++){
			let u=[];
			for(let j=0;j<this.viewTable.col;j++){
				let a=type===this.tableType.rowIndexTable?i:type===this.tableType.colIndexTable?j:i+","+j;
				u.push(<td id={type+"_"+a} key={type+"_"+a} className={style.td}>{a}</td>);		//delete {i} after testing
				if(type===this.tableType.rowIndexTable) break;
			}
			t.push(<tr id={type+"TR_"+i} key={type+"TR_"+i}className={style.tr}>{u}</tr>);
			if(type===this.tableType.colIndexTable) break;
		}
		return <tbody>{t}</tbody>;
	}

	getColGroup(id){
		let t=[];
		for(let i=0;i<this.viewTable.col;i++) t.push(<col id={id+i} key={id+i} className={style.col} />);
		return <colgroup>{t}</colgroup>
	}

	getDataTable(){
		return(
			<table id="dataTable" tabIndex="-1" className={style.table} onClick={this.tableClick} onKeyDown={this.tableKeyDown} onContextMenu={this.tableContextMenu} onPaste={this.tablePaste} onCopy={(e)=>e.preventDefault()} >
				{this.getColGroup("dataCOL_")}
				{this.getTbody(this.tableType.dataTable)}
			</table>
		);
	}

	getColIndexTable(){
		return	<table id="colIndexTable" className={style.table}>
					{this.getColGroup("cInxCOL_")}
					{this.getTbody(this.tableType.colIndexTable)}	
				</table>
	}

	getRowIndexTable(){
		return 	<table id="rowIndexTable" className={style.table}>
					<colgroup><col className={style.col} /></colgroup>
					{this.getTbody(this.tableType.rowIndexTable)}	
				</table>
	}

	/*****************functional function**********************/

	isShiftRange(r,c){return r>=this.selectedCells.shift.rowStart&&r<=this.selectedCells.shift.rowEnd&&c>=this.selectedCells.shift.colStart&&c<=this.selectedCells.shift.colEnd}
	isCtrlRange(r,c){return !!this.selectedCells.ctrl[r]&&!!(this.selectedCells.ctrl[r].indexOf(c)!=-1)}
	isExceptRange(r,c){return !!this.selectedCells.except[r]&&!!(this.selectedCells.except[r].indexOf(c)!=-1)}
	isSetFocusCell(){return this.selectedCells.focusCell.row>=0}
	isCellViewable(x,y){//x=id  y=undefined | x=row,y=col
		let id=y==undefined?x:"data_"+x+","+y;
		let el=document.getElementById(id);
		if(!el) return false;
		else{
			let rect=el.getBoundingClientRect();
			let refRect=this.tableDiv.getBoundingClientRect();
			if(rect.top>refRect.top&&rect.left>refRect.left&&rect.right<refRect.right&&rect.bottom<refRect.bottom)	return true;
			else return false;
		}
	}

	getCellRowCol(id){return id.split("_")[1].split(",").map(item=>parseInt(item))}
	getRowProps(r,c){return this.rowProps.filter(item=>item[0]==r)}
	getColProps(r,c){return this.colProps.filter(item=>item[0]==c)}
	getCopyStatus(){return this.copyStatus};
	getSelectedCellsColor(){return this.copyStatus?this.cellsColor.copy:this.cellsColor.selected}
	getActiveCellScroll(){
		if(this.isSetFocusCell()){
			let el=document.getElementById(this.selectedCells.focusCell.id);
			let viewP=this.tableDiv.getBoundingClientRect();
			if(el){
				let p=el.getBoundingClientRect();	
				if(p.left>viewP.left&&p.right<viewP.right&&p.top>viewP.top&&p.bottom<viewP.bottom)	return [this.tableDiv.scrollTop,						this.tableDiv.scrollLeft];
				else if(p.left>viewP.left&&p.right<viewP.right)										return [this.tableDiv.scrollTop-viewP.top+p.top,		this.tableDiv.scrollLeft];		
				else if(p.top>viewP.top&&p.bottom<viewP.bottom)										return [this.tableDiv.scrollTop,				this.tableDiv.scrollLeft-viewP.left+p.left];			
				else 																				return [this.tableDiv.scrollTop-viewP.top+p.top,this.tableDiv.scrollLeft-viewP.left+p.left];	
			}
			else{
				let a=function(props,start,defV){ return props.reduce((acc,item)=>{if(item[0]<start) acc+=item[2]-defV},0)+start*defV};
				let cellTop=	a(this.rowProps,this.selectedCells.focusCell.row,this.viewTable.defH);
				let cellLeft=	a(this.colProps,this.selectedCells.focusCell.col,this.viewTable.defW);

				if(this.tableDiv.scrollTop<cellTop&&this.tableDiv.scrollTop+this.tableDiv.clientHeight>cellTop)				return [this.tableDiv.scrollTop,  cellLeft];
				else if(cellLeft>this.tableDiv.scrollLeft&&cellLeft<this.tableDiv.scrollLeft+this.tableDiv.clientWidth)		return [cellTop, this.tableDiv.scrollLeft];
				else return [cellTop,cellLeft];
			}
		}
		else return null;
	}
	setCopyStatus(status){this.copyStatus=status};
	setFocusCell=(x,y,z,o)=>{	//id,offsetStart,offsetEnd
		if(x==undefined) console.error("setFoucsCell:didn't provide id");	
		else if(x!=undefined&&y!=undefined&&z!=undefined&&o!=undefined){	//x=row,y=col,z=startOffset,o=endOffset
			this.selectedCells.focusCell={id:"data_"+x+","+y,row:x,col:y,startOffset:z,endOffset:o}
		}
		else if(x!=undefined&&y!=undefined&&z!=undefined){	//x=id,y=startOffset,z=endOffset
			let [r,c]=this.getCellRowCol(x);
			this.selectedCells.focusCell={id:x,row:r,col:c,startOffset:y,endOffset:z};
		}
		else if(z==undefined){						//x=row,y=col
			[this.selectedCells.focusCell.row,this.selectedCells.focusCell.col,this.selectedCells.focusCell.id]=[x,y,"data_"+x+","+y];
		}
		else if(y==undefined&&z==undefined){		//x=id
			let [r,c]=this.getCellRowCol(x);
			[this.selectedCells.focusCell.row,this.selectedCells.focusCell.col,this.selectedCells.focusCell.id]=[r,c,x];
		}
		else console.error("setFoucsCell: x="+x+"  y="+y+"  z="+z);
	}

	setShift(id){			
		try{
			let [r,c]=this.getCellRowCol(id);
			let a=this.selectedCells.focusCell;
			[this.selectedCells.shift.rowStart,this.selectedCells.shift.rowEnd]=r>a.row?[a.row,r]:[r,a.row];
			[this.selectedCells.shift.colStart,this.selectedCells.shift.colEnd]=c>a.col?[a.col,c]:[c,a.col];

			this.selectedCells.except={};
			Object.keys(this.selectedCells.ctrl).forEach(r=>{
				let t=this.selectedCells.ctrl[r].filter(c=>!this.isShiftRange(r,c));
				if(t.length==0)	delete this.selectedCells.ctrl[r];
				else this.selectedCells.ctrl[r]=t;
			});
		}
		catch(err){ console.error("setShift: didn't get para 'id'="+id+", unknow reason, may click too quick? Effect: none")}

	}
	setCtrl(x,y){
		let[r,c]=y!=undefined?[x,y]:this.getCellRowCol(x);
		let a=function(r,c,obj){
			if(obj[r]){
				let index=obj[r].indexOf(c);
				if(index==-1) obj[r].push(c);
				else {
					obj[r].splice(index,1);
					if(obj[r].length==0)	delete obj[r];
				}
			}
			else obj[r]=[c];
		}

		if(this.isShiftRange(r,c)) 	a(r,c,this.selectedCells.except);
		else 						a(r,c,this.selectedCells.ctrl);

	}
	setBackgroundSelectedCells(row,col){
		if(row!==undefined){
			if((this.isShiftRange(row,col)&&!this.isExceptRange(row,col))||this.isCtrlRange(row,col))	document.getElementById("data_"+row+","+col).style.backgroundColor=this.getSelectedCellsColor();
			else document.getElementById("data_"+row+","+col).style.backgroundColor=this.cellsColor.normal;
		}
		else {
			this.loopTable((i,j)=>{
				let [r,c]=this.getCellRowCol(this.table.rows[i].cells[j].id);
				if((this.isShiftRange(r,c)&&!this.isExceptRange(r,c))||this.isCtrlRange(r,c))	this.table.rows[i].cells[j].style.backgroundColor=this.getSelectedCellsColor();	
				else 												this.table.rows[i].cells[j].style.backgroundColor=this.cellsColor.normal;
			});
		}
		
	}
	setTableWrapperHeight(x){
		document.getElementById("dataTableWrapper").style.height=x+"px";
	}
	setTableWrapperWidth(x){
		document.getElementById("dataTableWrapper").style.width=x+"px";
	}
	addToTableWrapperHeight(x){
		document.getElementById("dataTableWrapper").style.height=(document.getElementById("dataTableWrapper").getBoundingClientRect().height+x)+"px";
	}
	addToTableWrapperWidth(x){
		document.getElementById("dataTableWrapper").style.width=(document.getElementById("dataTableWrapper").getBoundingClientRect().width+x)+"px";
	}

	setActTableRow(){
		this.actTable.row=this.actTable.row>this.data.length?this.actTable.row:this.data.length;
	}
	setActTableHeight(){
		let t=this.rowProps.length?this.rowProps[this.rowProps.length-1]:[0,this.viewTable.defH,0];
		this.actTable.height=(this.actTable.row-t[0]-1)*this.viewTable.defH+t[1]+t[2];

	}
	setViewTableLastTop(){
		let t=this.rowProps.filter(item=>item[0]<this.actTable.row-this.viewTable.row);
		this.viewTable.lastTop=t.length==0?(this.actTable.row-this.viewTable.row)*this.viewTable.defH:t[t.length-1][1]+t[t.length-1][2]+(this.actTable.row-t[t.length-1][0]-this.viewTable.row-1)*this.viewTable.defH;
	}
	setActTableCol(){
		let dataCol=0;
		this.data.forEach((item)=>dataCol=item.length>dataCol?item.length:dataCol);
		this.actTable.col=this.actTable.col>dataCol?this.actTable.col:dataCol;
	}

	setActTableWidth(){
		let t=this.colProps.length?this.colProps[this.colProps.length-1]:[0,this.viewTable.defW,0];
		this.actTable.width=(this.actTable.col-t[0]-1)*this.viewTable.defW+t[1]+t[2];
	}
	setViewTableLastLeft(){
		let t=this.colProps.filter(item=>item[0]<this.actTable.col-this.viewTable.col);
		this.viewTable.lastLeft=t.length==0?(this.actTable.col-this.viewTable.col)*this.viewTable.defW:t[t.length-1][1]+t[t.length-1][2]+(this.actTable.col-t[t.length-1][0]-this.viewTable.col-1)*this.viewTable.defW;
	}
	setRowIndexHeight(){
		document.getElementById("rowIndexTableWrapper").style.height=document.getElementById("dataTableWrapper").getBoundingClientRect().height+"px";
	}
	setColIndexWidth(){
		document.getElementById("colIndexTableWrapper").style.width=document.getElementById("dataTableWrapper").getBoundingClientRect().width+"px";
	}
	setTableProps(set){
		if(!set)	this.setActTableRow();
		this.setActTableHeight();
		this.setTableWrapperHeight(this.actTable.height+2);
		this.setViewTableLastTop();
		this.setRowIndexHeight();

		if(!set)	this.setActTableCol();
		this.setActTableWidth();
		this.setTableWrapperWidth(this.actTable.width+2);
		this.setViewTableLastLeft();
		this.setColIndexWidth();
	}
	setVisibility(id,str){
		document.getElementById(id).style.visibility=str;
	}
	setAllMenuHidden(){
		document.getElementById("deletePopMenu").style.visibility="hidden";
		document.getElementById("insertPopMenu").style.visibility="hidden";
		document.getElementById("tableContextMenu").style.visibility="hidden";
	}
	sortProps(arr){	//either rowProps or colProps
		arr.sort(function(a,b){ return a[0]-b[0]});
	}
	loopTable(a){
		for(let i=0;i<this.viewTable.row;i++) for(let j=0;j<this.viewTable.col;j++) a(i,j);
	}

	clearSelectedCells(){
		this.selectedCells.ctrl={};
		this.selectedCells.except={};
		Object.keys(this.selectedCells.shift).forEach(item=>this.selectedCells.shift[item]=-1);
		this.setBackgroundSelectedCells();
	}
	iniClearTableContent(){
		for(let i=0;i<this.viewTable.row;i++){
			for(let j=0;j<this.viewTable.col;j++){
				document.getElementById("data_"+i+","+j).childNodes[0].nodeValue="";
			}
		}
	}
	refreshTable(){
		for(let i=0;i<this.viewTable.row;i++){
			for(let j=0;j<this.viewTable.col;j++){
				document.getElementById("data_"+(this.currentRowCol.row+i)+","+(this.currentRowCol.col+j)).childNodes[0].nodeValue=this.data[this.currentRowCol.row+i]!=undefined?this.data[this.currentRowCol.row+i][this.currentRowCol.col+j]:"";
			}
		}
	}
	moveToCell(scroll){	//[left,top];
		if(scroll){
			this.tableDiv.scrollLeft=scroll[1];
			setTimeout(function(){this.tableDiv.scrollTop=scroll[0]},20);	//if set both simultanousely, will cause one other does't be detected
		}
	}
	deleteAction=(str)=>{
		let a=this.selectedCells.shift;
		let b=this.selectedCells.ctrl;

		let clear=(r,c,f)=>{if(this.data[r]&&this.data[r][c]!=undefined) f(r,c)};
		let f0=function(a,b){return a-b};	//small to large
		let f1=function(a,b){return b-a};	//large to small
		let f2=(fun1,fun2)=>{
			for(let i=a.rowEnd;i>=a.rowStart;i--){
				for(let j=a.colEnd;j>=a.colStart;j--){if(!this.isExceptRange(i,j))   fun1(i,j,fun2);}
			}	
			Object.keys(b).forEach(row=>{b[row].sort(f1);b[row].forEach(col=>fun1(row,col,fun2))});
		}
		let f3=(offset,i,fun)=>{
			let temp=[]
			for(let j=offset;j<this.data.length;j++)	{if(fun(j))	temp.push(this.data[j][i])};
			for(let j=offset;j<this.data.length;j++)	this.data[j][i]=temp[j-offset];	
		}
		let f4=(arr,l1,l2,l3,l4)=>{
			for(let i=l1;i<=l2;i++){
				for(let j=l3;j<=l4;j++) {if(!this.isExceptRange(i,j)) {arr.push(i);break;}}
			}
			arr.sort(f1);
		}

		if(!this.isShiftRange(this.selectedCells.focusCell.row,this.selectedCells.focusCell.col)) this.setShift(this.selectedCells.focusCell.id);

		if(str=="content")				f2(clear,(r,c)=>{delete this.data[r][c]});
		else if(str=="cells up"){
			let t={};
			Object.keys(b).forEach(row=>b[row].forEach(col=>t[col]?t[col].push(parseInt(row)):t[col]=[parseInt(row)]));
			Object.keys(t).forEach(c=>t[c].sort(f0));

			for(let i=a.colStart;i<=a.colEnd;i++){
				let offset=t[i]&&t[i][0]<a.rowStart?t[i][0]:a.rowStart;	
				f3(offset,i,(j)=>{return ((!t[i]||t[i].indexOf(j)==-1)&&(j<a.rowStart||j>a.rowEnd))||this.isExceptRange(j,i)});
				delete t[i];
			}

			Object.keys(t).forEach(i=>f3(t[i][0],i,(j)=>{return t[i].indexOf(j)==-1}));
		}
		else if(str=="cells left")		f2(clear,(r,c)=>{this.data[r].splice(c,1)});
		
		else if(str=="row"){
			let t=Object.keys(b).filter(i=>i<a.rowStart||i>a.rowEnd);		//because filter is much more efficient than indexof
			f4(t,a.rowStart,a.rowEnd,a.colStart,a.colEnd);
			t.forEach(r=>this.data.splice(r,1));
		}
		else if(str=="col"){
			let t=[];
			Object.keys(b).forEach(row=>b[row].forEach(col=>{if(t.indexOf(col)==-1) t.push(col)}));
			t=t.filter(i=>i<a.colStart||i>a.colEnd);
			f4(t,a.colStart,a.colEnd,a.rowStart,a.rowEnd);

			t.forEach(c=>this.data.forEach(v=>v.splice(c,1)));

		}
		this.clearSelectedCells();
		this.refreshTable();
	}
	insertAction=(obj)=>{
		this.clearSelectedCells();
		let a=this.selectedCells.focusCell;
		let f1=(data,startIndex)=>{if(startIndex<data.length-1){for(let i=0;i<obj.value;i++)	data.splice(startIndex+1,0,[])}};

		if(obj.type=="rows")			f1(this.data,a.row);
		else if(obj.type=="columns")	this.data.forEach(item=>f1(item,a.col));
		else if(obj.type=="cells"){
			if(obj.direction=="down"){
				if(a.row<this.data.length-1){
					let temp=[],lastEmpty=true;
					for(let i=this.data.length-1;i>a.row;i--){
						if(lastEmpty&&this.data[i][a.col]!=undefined)	lastEmpty=false;
						if(!lastEmpty) temp.push(this.data[i][a.col]);
					}
					for(let i=a.row+obj.value+1;i<a.row+temp.length+obj.value+1;i++){
						if(!this.data[i]) this.data[i]=[];
						this.data[i][a.col]=temp[a.row+temp.length+obj.value-i];
					}
					for(let i=0;i<obj.value;i++) this.data[a.row+1+i][a.col]=undefined;
				}

			}
			else{if(a.col<this.data[a.row].length-1){for(let i=0;i<obj.value;i++)	this.data[a.row].splice(a.col+1,0,undefined);}}
		}

		this.setTableProps();
		this.refreshTable();
		this.moveToCell(this.getActiveCellScroll());
	}

	/*****************functional function End**********************/

	/**************keyboard action***************/
	tableKeyDown=(e)=>{
		this.setCopyStatus(false);
		if(e.ctrlKey&&e.keyCode==67)	this.copy();
		else if(e.keyCode==13||e.keyCode==9||e.keyCode===40||(e.ctrlKey&&e.keyCode===39)){
			if(!this.isCellViewable(this.selectedCells.focusCell.id)) this.moveToCell(this.getActiveCellScroll());
			e.preventDefault();
			let [r0,c0]=this.getCellRowCol(e.target.id);
			let [r,c,index,maxType,defV,x1,x2,x3,x4,t]=	e.keyCode==13||e.keyCode===40?				[r0+1,c0,r0+1,"row",this.viewTable.defH,"top","clientHeight","bottom","scrollTop",this.getRowProps(r0+1,c0)]:
																									[r0,c0+1,c0+1,"col",this.viewTable.defW,"left","clientWidth","right","scrollLeft",this.getColProps(r0,c0+1)];
			let o=(this.data[r]&&this.data[r][c])?this.data[r][c].length:0;
			this.setFocusCell(r,c,o,o);

			if(this.tableDiv.getBoundingClientRect()[x1]+this.tableDiv[x2]-e.target.getBoundingClientRect()[x3]<(t.length==0?defV:t[0][1])){
				if(index>this.actTable[maxType]-1){
					this.actTable[maxType]=index+1;
					this.setTableProps(true);
				}
				this.tableDiv[x4]+=(t.length==0?defV:t[0][1]);
			}
			else{
				let tel=document.getElementById("data_"+r+","+c);
				if(tel)	this.preFocusCell(tel);
			}
		}
		else if(e.keyCode===38||e.ctrlKey&&e.keyCode===37){
			if(!this.isCellViewable(this.selectedCells.focusCell.id)) this.moveToCell(this.getActiveCellScroll());
			e.preventDefault();
			let [r0,c0]=this.getCellRowCol(e.target.id);
			let [r,c,defV,x1,x2,t]=	e.keyCode===38?	[r0-1,c0,this.viewTable.defH,"top","scrollTop",this.getRowProps(r0-1,c0)]:
													[r0,c0-1,this.viewTable.defW,"left","scrollLeft",this.getColProps(r0,c0-1)];
			if(r>-1&&c>-1){
				let o=(this.data[r]&&this.data[r][c])?this.data[r][c].length:0;
				this.setFocusCell(r,c,o,o);

				if(e.target.getBoundingClientRect()[x1]-this.tableDiv.getBoundingClientRect()[x1]<(t.length==0?defV:t[0][1])){
					this.tableDiv[x2]-=(t.length==0?defV:t[0][1]);
				}
				else{
					let tel=document.getElementById("data_"+r+","+c);
					if(tel)	this.preFocusCell(tel);
				}
			}
			e.stopPropagation();
		}
		else if(e.ctrlKey){}
		else if(e.shiftKey){}
		else if(e.keyCode===46){	//delete
			this.moveToCell(this.getActiveCellScroll());
			e.preventDefault();
			setTimeout(()=>{
				let cell=document.getElementById(this.selectedCells.focusCell.id);
				if(cell){		
					this.setVisibility("deletePopMenu","visible");
					let el=document.getElementById("deletePopMenu");
					document.getElementById("deletePopMenuLegend").childNodes[0].nodeValue="delete";
					let cRect=cell.getBoundingClientRect();
					let dRect=el.getBoundingClientRect();
					let refRect=this.tableDiv.getBoundingClientRect();


					el.style.top=((cRect.bottom+dRect.height>refRect.bottom?cRect.top-dRect.height:cRect.bottom))+"px";
					el.style.left=((cRect.right+dRect.width>refRect.right?cRect.left-dRect.width:cRect.right))+"px";			
				}
			},50);			///make sure the time delay is enough for scroll processing done
		}
		else{
			if(!this.isCellViewable(this.selectedCells.focusCell.id)) this.moveToCell(this.getActiveCellScroll());
			if(this.selectedCells.rowStart!=-1) this.clearSelectedCells();	
		}
	}
	
	dataCellInput=(e)=>{
		let [r,c]=this.getCellRowCol(e.target.id);
		if(!this.data[r]) this.data[r]=[];
		this.data[r][c]=e.target.childNodes[0].nodeValue;
		this.range=this.selection.getRangeAt(0);
		[this.selectedCells.focusCell.startOffset,this.selectedCells.focusCell.endOffset]=[this.range.startOffset,this.range.endOffset];
	}

	/**************keyboard action Ends***************/



	/**************Focus Blur Action****************/
	preFocusCell(el,start,end){
		el.setAttribute("contentEditable","true");
		this.range.setStart(el.childNodes[0],(start!==undefined&&start>-1)?start:el.innerText.length);
		this.range.setEnd(el.childNodes[0],(end!==undefined&&end>-1)?end:el.innerText.length);
		this.selection.removeAllRanges();
		this.selection.addRange(this.range);
		el.addEventListener("blur",this.dataCellBlur);
		el.addEventListener("mousedown",this.dataCellMouseDown);
		el.addEventListener("input",this.dataCellInput);
		el.style.overflow="visible";
	}
	preBlurCell(el){
		el.removeAttribute("contentEditable");
		el.removeEventListener("blur",this.dataCellBlur);
		el.removeEventListener("mousedown",this.dataCellMouseDown);
		el.removeEventListener("input",this.dataCellInput);
		el.style.overflow="visible hidden";
	}

	dataCellBlur=(e)=>{
		this.preBlurCell(e.target);

		if(e.target.clientWidth<e.target.scrollWidth)	e.target.style.overflow="hidden visible";
		//console.log(e.target.id+" blur");
		//console.log(document.activeElement.id+" active");
		e.stopPropagation();
	}


	/**************Focus Blur Action Ends**************/

	/**************Copy Pasta Action*****************/
	copy=(e)=>{
		console.log("copy");
		this.setCopyStatus(true);
		let a=this.selectedCells.shift, b=this.selectedCells.ctrl;
		let temp=[];
		let shiftMinCol,shiftMinRow,ctrlMinCol=Number.MAX_SAFE_INTEGER;
		let keys=Object.keys(b).sort((a,b)=>a-b);

		let findMin=function(iStart,iEnd,jStart,jEnd,fun){
			let min,stop=false;
			for(let i=iStart;i<=iEnd;i++){
				for(let j=jStart;j<=jEnd;j++){if(fun(i,j)) {stop=true; min=i; j=jEnd+1; i=iEnd+1;}}
			}
			return min;
		}

		shiftMinRow=findMin(a.rowStart,a.rowEnd,a.colStart,a.colEnd,(i,j)=>{return !this.isExceptRange(i,j)});
		shiftMinCol=findMin(a.colStart,a.colEnd,a.rowStart,a.rowEnd,(i,j)=>{return !this.isExceptRange(j,i)});
		keys.forEach(i=>b[i].forEach(j=>ctrlMinCol=ctrlMinCol<j?ctrlMinCol:j));
		
		let rowOffset=keys[0]==undefined?shiftMinRow:shiftMinRow>keys[0]?keys[0]:shiftMinRow;
		let colOffset=ctrlMinCol>shiftMinCol?shiftMinCol:ctrlMinCol;

		for(let i=a.rowStart;i<=a.rowEnd;i++){
			for(let j=a.colStart;j<=a.colEnd;j++){
				if(!this.isExceptRange(i,j)){
					if(!temp[i-rowOffset]) temp[i-rowOffset]=[];
					temp[i-rowOffset][j-colOffset]=this.data[i][j];
				}
			}
		}
		
		keys.forEach((i)=>{
			if(!temp[i-rowOffset]) temp[i-rowOffset]=[];
			b[i].forEach((j)=>temp[i-rowOffset][j-colOffset]=this.data[i][j])
		});

		let cd="";
		for(let i=0;i<temp.length;i++){
			for(let j=0;j<temp[i].length;j++){
				cd+=(temp[i][j]==undefined?"":temp[i][j]);
				if(j!=temp[i].length-1) cd+="\t";
			}
			if(i!=temp.length-1) cd+="\n"
		}
		if(window.clipboardData)	window.clipboardData.setData("text/plain",cd);		/******didn't test********/
		
		else{	//chrome
			navigator.clipboard.writeText(cd).catch(err=>{alert("you have deny the cilipboard permissions, so can't perform copy")});
		}
	}

	tablePaste=(e)=>{
		e.preventDefault();
		
	    let clipText = '';
	    let a=this.selectedCells.focusCell; 

	    var paste=(t)=>{
	    	let temp=t.split(/\r?\n/).map(item=>item.split("\t"));
	    	if(temp.length==1&&temp[0].length==1){
	    		let str=this.data[a.row][a.col].toString();
	    		str=str.slice(0,a.startOffset)+temp[0][0]+str.slice(a.endOffset);
	    		this.data[a.row][a.col]=str;
	    	}
	    	else{

	    		if(temp[temp.length-1][0]=="") temp.splice(temp.length-1,1);
	        	for(let i=0;i<temp.length;i++){
	        		if(this.data[i+a.row]==undefined) this.data[i+a.row]=[];
	        		for(let j=0;j<temp[i].length;j++){
	        			this.data[i+a.row][j+a.col]=temp[i][j];
	        		}
	        	}
	        	let offset=this.data[a.row][a.col]===undefined?0:this.data[a.row][a.col].length;
	        	[a.startOffset,a.endOffset]=[offset,offset];
	        }
	        this.refreshTable();
	    }

	    if (window.clipboardData && window.clipboardData.getData) {
	        clipText = window.clipboardData.getData('Text');
	        paste(clipText);
	    }
	    else if (e.clipboardData && e.clipboardData.getData) {
	        clipText = e.clipboardData.getData('text/plain');
	        paste(clipText);
	    } 
	    else{
	        this.preFocusCell(document.getElementById(a.id),a.startOffset,a.endOffset);
	        navigator.clipboard.readText().then(clipText=>paste(clipText));
	    }   
	}

	/**************Copy Pasta Action Ends****************/

	/**************Mouse Action*****************/


	calViewCell(value,props,defV,indexLimit,positionLimit){
		let cellIndex,cellPosition;
		let getNumber=function(v,defV){
			let a=Math.floor(v/defV)
			return [a,a*defV];
		};

		if(props.length==0)		[cellIndex,cellPosition]=getNumber(value,defV);	
		else{												
			let arr=props;
			let j=0;
			let index=Math.ceil(props.length/2);
			while(arr.length>1&&++j<30){
				if(arr[index][2]>value)		arr=arr.slice(0,index);
				else						arr=arr.slice(index);
				index=Math.ceil(arr.length/2);
			}
			if(arr.length===0)	[cellIndex, cellPosition]=getNumber(value,defV);		
			else {
				let a=arr[0];
				if(a[2]>value)	[cellIndex,cellPosition]=getNumber(value,defV);
				else if(a[1]+a[2]>value)	[cellIndex,cellPosition]=[a[0],a[2]];
				else{
					let [t1,t2]=getNumber(value-a[2]-a[1],defV);
					[cellIndex,cellPosition]=[a[0]+t1+1,a[2]+a[1]+t2];
				}
			}
		}
		if(cellIndex+1>indexLimit)	return [indexLimit,positionLimit];
		return [cellIndex,cellPosition];
	}

	tableScroll=(e)=>{
		let a=function(el){
				if(el.scrollTop!==this.preScrollTop){
					this.preScrollTop=el.scrollTop;
					return [el.scrollTop,this.rowProps,this.viewTable.defH,"top",this.rowTable,document.getElementById("rowIndexDiv"),"scrollTop",this.viewTable.row,"row",this.viewTable.lastTop];
				}
				else return [el.scrollLeft,this.colProps,this.viewTable.defW,"left",this.colTable,document.getElementById("colIndexDiv"),"scrollLeft",this.viewTable.col,"col",this.viewTable.lastLeft];
		}.bind(this);

		let [scroll,props,defV,type,indexTable,scrollDiv,scrollType,defNum,defNumType,limit]=a(e.target);
		scrollDiv[scrollType]=scroll;

		let b=function(elID,type,value)	{elID.forEach(item=>document.getElementById(item).style[type]=value);}
		let cssArr={},t=this.calViewCell(scroll,props,defV,this.actTable[defNumType]-defNum,limit);
					
		props.forEach(item=> {if(item[0]-t[0]<defNum) cssArr[item[0]]=item[1]});
				
		for(let i=0;i<this.viewTable.row;i++){
			if(type=="top"){
				if(i==0)	this.currentRowCol.row=t[0];
				document.getElementById("rInx_"+i).childNodes[0].nodeValue=t[0]+i;
				b(["rInxTR_"+i,"dataTR_"+i],"height",(cssArr[t[0]+i]?cssArr[t[0]+i]:defV)+"px");
			}
			for(let j=0;j<this.viewTable.col;j++){
				if(type=="left"&&i==0){
					if(j==0)	this.currentRowCol.col=t[0];
					document.getElementById("cInx_"+j).childNodes[0].nodeValue=t[0]+j;
					b(["cInxCOL_"+j,"dataCOL_"+j],"width",(cssArr[t[0]+j]?cssArr[t[0]+j]:defV)+"px");
				}
					/**********modify when enter <br> applys********/
				this.table.rows[i].cells[j].id="data_"+(this.currentRowCol.row+i)+","+(this.currentRowCol.col+j);
				if(this.table.rows[i].cells[j].childNodes[0])	this.table.rows[i].cells[j].childNodes[0].nodeValue=this.data[this.currentRowCol.row+i]?this.data[this.currentRowCol.row+i][this.currentRowCol.col+j]:"";
				this.setBackgroundSelectedCells(this.currentRowCol.row+i,this.currentRowCol.col+j);
			}
		}
		indexTable.style[type]=t[1]+"px";
		this.table.style[type]=t[1]+"px";

		let tel=document.getElementById(this.selectedCells.focusCell.id);
		if(tel)	this.preFocusCell(tel,this.selectedCells.focusCell.startOffset,this.selectedCells.focusCell.endOffset);
		else 	document.getElementById("dataTable").focus();
	}

	tableClick=(e)=>{
		this.setAllMenuHidden();
		this.setCopyStatus(false);
		
		if(e.shiftKey){
			e.preventDefault();
			if(!this.isSetFocusCell())	this.setFocusCell(e.target.id,e.target.innerText.length,e.target.innerText.length);
			this.setShift(e.target.id);
		}
		else if(e.ctrlKey){
			if(!this.isSetFocusCell())	this.setFocusCell(e.target.id,e.target.innerText.length,e.target.innerText.length);
			if(!this.isShiftRange(this.selectedCells.focusCell.row,this.selectedCells.focusCell.col)){
				this.setShift(this.selectedCells.focusCell.id);
				if(e.target.id!==this.selectedCells.focusCell.id)	this.setCtrl(e.target.id);
			}
			else this.setCtrl(e.target.id);
		}
		else{
			this.clearSelectedCells();
			if(document.activeElement!=e.target&&e.target.tagName=="TD"){
				this.setFocusCell(e.target.id,e.target.innerText.length,e.target.innerText.length);
				this.preFocusCell(e.target);
			}
			else{		
				let range=window.getSelection().getRangeAt(0);
				this.setFocusCell(range.startContainer.parentNode.id,range.startOffset,range.endOffset);		
			}
		}
		this.setBackgroundSelectedCells();
	}

	tableContextMenu=(e)=>{
		e.preventDefault();
		this.setAllMenuHidden();

		let el=document.getElementById("tableContextMenu");
		el.style.visibility="visible";

		let elRect=el.getBoundingClientRect();
		el.style.top=((e.clientY+elRect.height>this.tableDiv.getBoundingClientRect().bottom?e.clientY-elRect.height:e.clientY))+"px";
		el.style.left=((e.clientX+elRect.width>this.tableDiv.getBoundingClientRect().right?e.clientX-elRect.width:e.clientX))+"px";

	}

	
	mouseMove=(e)=>{
		if(this.drag.enable){
			let move=e[this.drag.type.coodinate]-this.drag.startPosition;
			let value=move+this.drag.elV<this.drag.type.defValue?this.drag.type.defValue:move+this.drag.elV;

			this.drag.affectElements[1].style[this.drag.type.style]=value+"px";
			this.drag.affectElements[2].style[this.drag.type.style]=value+"px";
		}
		else{
			if(e.target.id.match(this.tableType.rowIndexTable)){//e.target.id.startsWith(this.tableType.rowIndexTable))){
				let r=e.target.getBoundingClientRect();
				if((e.target.id.match(/_0$/)&&e.clientY<this.cursorSensitive+r.top)||(!e.target.id.endsWith(this.viewTable.row-1)&&e.clientY>r.bottom-this.cursorSensitive))		document.getElementById("analyseDiv").style.cursor="row-resize";
				else document.getElementById("analyseDiv").style.cursor="default";
			}
			else if(e.target.id.match(this.tableType.colIndexTable)){//e.target.id.startsWith(this.tableType.colIndexTable)){
				let r=e.target.getBoundingClientRect();
				if((e.target.id.match(/_0$/)&&e.clientX<this.cursorSensitive+r.left)||(!e.target.id.endsWith(this.viewTable.col-1)&&e.clientX>r.right-this.cursorSensitive))		document.getElementById("analyseDiv").style.cursor="col-resize";
				else document.getElementById("analyseDiv").style.cursor="default";
			}
			else if(document.getElementById("analyseDiv").style.cursor!=="default") document.getElementById("analyseDiv").style.cursor="default";
		}
	}
	mouseDown=(e)=>{
		if(document.getElementById("analyseDiv").style.cursor.match(/resize$/)){
			let id=parseInt(e.target.id.split("_")[1]);
			let r=e.target.getBoundingClientRect();	
			if(document.getElementById("analyseDiv").style.cursor.match(/^row/)){
					this.drag.type={style:"height",coodinate:"clientY",prop:"top",defValue:this.viewTable.defH,label:["rInx_","rInxTR_","dataTR_"]};
			}
			else	this.drag.type={style:"width",coodinate:"clientX",prop:"left",defValue:this.viewTable.defW,label:["cInx_","cInxCOL_","dataCOL_"]};		

			let tID=parseInt(e.target.id.split("_")[1])-(e[this.drag.type.coodinate]<(this.cursorSensitive+r[this.drag.type.prop])?1:0);
			this.drag.affectElements=this.drag.type.label.map(item=>document.getElementById(item+tID));	
			this.drag.startPosition=e[this.drag.type.coodinate];
			this.drag.elV=this.drag.affectElements[0].getBoundingClientRect()[this.drag.type.style];
			this.drag.enable=true;
		}
	}

	mouseUp=(e)=>{
		if(this.drag.enable){
			this.drag.enable=false;
			this.propsAdd(this.drag.type.style=="height"?this.rowProps:this.colProps);
			this.setTableProps();
		}
	}

	propsAdd(arr){
		let actualIndex=parseInt(this.drag.affectElements[0].innerHTML);
		let i;
		let a=arr.filter((item,index)=>item[0]===actualIndex);
		
		if(a.length!=0){
			a[0][1]=this.drag.affectElements[0].getBoundingClientRect()[this.drag.type.style];
		}
		else{
			let r=this.drag.affectElements[0].getBoundingClientRect();
			let newData=[actualIndex,r[this.drag.type.style],0];
			arr.push(newData);
			this.sortProps(arr);
		}
		arr.forEach((item,index)=>{if(item[0]===actualIndex) i=index});

		for(let j=i;j<arr.length;j++){
			if(i==0)	arr[j][2]=arr[j][0]*this.drag.type.defValue;
			else arr[j][2]=arr[j-1][2]+arr[j-1][1]+(arr[j][0]-arr[j-1][0]-1)*this.drag.type.defValue;
		}
	}

	/*******************Mouse Action Ends**********************/

	/**************File Drop***************/
	onload=(e)=>{
		//console.log(e.target.result);
		var data=new Uint8Array(e.target.result);
		var workbook=XLSX.read(data,{type:'array',raw:true});
		//console.log(workbook);
		this.data.length=0;
		var worksheet=workbook.Sheets[workbook.SheetNames[0]];
		//console.log(worksheet);
		let maxCol=0;
		Object.keys(worksheet).forEach(key=>{
			let a=key.match(/(^[A-Z]+)([0-9]+$)/);
			if(a){
			let [tempCol,row]=[a[1],parseInt(a[2])-1];

			//console.log("tempCol="+tempCol+"  row="+row);
			
			let col=0;
			for(let i=tempCol.length-1;i>=0;i--){
				col+=(tempCol.charCodeAt(i)-65)*Math.pow(26,i);			//A charCode is 65
			}
			maxCol=maxCol>col?maxCol:col;
			if(!this.data[row]) this.data[row]=[];
			this.data[row][col]=worksheet[key].v;
			}
		});
		//console.log(this.data);
		this.setTableProps(false);
		this.refreshTable();
		this.moveToCell([0,0]);
	}

	fileDrop=(e)=>{
		e.preventDefault();
		var files=e.dataTransfer.files;
		/* 
			excel file must be unzip firstly, then can be read. so it can not avoid unzip process to provide stream directly.
			all other file type such as txt, csv can be read locally even if the size if large as they can be streamed. 
		*/
		if(files[0].size>15*1024*1024) alert("the file is too large, in oder to improve performance, it will be uploaded to server");
		else{
			var reader=new FileReader();
			reader.onload=this.onload;
			reader.readAsArrayBuffer(files[0]);
		}
	}
	dragover=(e)=>{
		e.preventDefault();
	}
	/**************File Drop End***************/

	render(){
		return(
			<div id="analyseDiv" className={style.analyseDiv} onMouseMove={this.mouseMove} onMouseDown={this.mouseDown}onMouseUp={this.mouseUp}>
				<div id="colIndexDiv" className={style.colIndexDiv} >
					<div id="colIndexTableWrapper" className={style.colIndexTableWrapper}>
						{this.getColIndexTable()}
					</div>
				</div>
				<div id="rowIndexDiv" className={style.rowIndexDiv}>
					<div id="rowIndexTableWrapper" className={style.rowIndexTableWrapper}>
						{this.getRowIndexTable()}
					</div>
				</div>

				<div id="tableDiv" className={style.tableDiv}  onScroll={this.tableScroll} onDragOver={this.dragover} onDrop={this.fileDrop}>
					<div id="dataTableWrapper" className={style.dataTableWrapper}>
						{this.getDataTable()}
					</div>
				</div>

				<DeletePopMenu action={this.deleteAction}/>
				<TableContextMenu paste={this.tablePaste} copy={this.copy} delete={this.deleteAction}/>
				<InsertPopMenu action={this.insertAction}/>
				
			</div>
		);
	}
}

function DeletePopMenu(props){
	var buttonClick=(e)=>{
		if(e.target.value==="ok")	props.action(new FormData(document.getElementById("deleteCellForm")).get("delete"));
		document.getElementById("deletePopMenu").style.visibility="hidden";
	}

	return(
		<div id="deletePopMenu" className={style.popMenuDiv} tabIndex="-1">
			<form id="deleteCellForm">
				<fieldset className={style.popMenuFieldSet}>
					<legend id="deletePopMenuLegend">delete</legend>
					<input type="radio" name="delete" value="content"		className={style.deletePopMenuInput} defaultChecked/>clear content<br/>
					<input type="radio" name="delete" value="cells up" 		className={style.deletePopMenuInput}/>shift cells up<br/>
					<input type="radio" name="delete" value="cells left" 	className={style.deletePopMenuInput}/>shift cells left<br/>
					<input type="radio" name="delete" value="row" 			className={style.deletePopMenuInput}/>entire row<br/>
					<input type="radio" name="delete" value="col" 			className={style.deletePopMenuInput}/>entire column<br/>
				</fieldset>
			</form>
			<button value="ok" 		onClick={buttonClick} className={style.deletePopMenuButton}>ok</button>
			<button value="cancel" 	onClick={buttonClick} className={style.deletePopMenuButton}>cancel</button>
		</div>
	);
}

class InsertPopMenu extends React.Component{
	constructor(props){
		super(props);
		this.state={
			value:1
		}
	}
	buttonClick=(e)=>{
		var a=new FormData(document.getElementById("insertCellForm"));
		document.getElementById("insertPopMenu").style.visibility="hidden";
		let [type,direction]=a.get("insert").split(" ");
		if(e.target.value==="ok") this.props.action({type:type,direction:direction,value:parseInt(a.get("value"))});
	}

	inputKeyDown(e){
		if(e.keyCode==189||e.keyCode==187) e.preventDefault();
	}
	inputChange=(e)=>{
		this.setState({value:((parseInt(e.target.value)>1000)?1000:e.target.value)});
	}
	inputBlur=(e)=>{
		if(e.target.value==""||e.target.value=="0") this.setState({value:1});
	}

	render(){
		return(
			<div id="insertPopMenu" className={style.popMenuDiv} tabIndex="-1">
				<form id="insertCellForm">
					<fieldset className={style.popMenuFieldSet}>
						<legend id="insertPopMenuLegend">insert</legend>
						<input type="radio" name="insert" className={style.deletePopMenuInput} value="cells down" defaultChecked/>cells down<br/>
						<input type="radio" name="insert" className={style.deletePopMenuInput} value="cells right"/>cells right<br/>
						<input type="radio" name="insert" className={style.deletePopMenuInput} value="rows down"/>rows down<br/>					
						<input type="radio" name="insert" className={style.deletePopMenuInput} value="columns right"/>columns right<br/>
						<input name="value" type="number" className={style.insertElement}  min="1" max="1000" autoComplete="off" value={this.state.value}  onKeyDown={this.inputKeyDown} onChange={this.inputChange} onBlur={this.inputBlur}/>
					</fieldset>
				</form>
				<button value="ok" 		onClick={this.buttonClick} className={style.deletePopMenuButton}>ok</button>
				<button value="cancel" 	onClick={this.buttonClick} className={style.deletePopMenuButton}>cancel</button>
			</div>
		)
	}
}

function TableContextMenu(props){

	var click=(e)=>{
		document.getElementById("tableContextMenu").style.visibility="hidden";
		let a=e.target.childNodes[0].nodeValue
		if(a.match(/cut/)) setCut(e);
		else if(a.match(/delete/)) setDelete(e);
		else if(a.match(/copy/)) setCopy(e);
		else if(a.match(/pasta/)) setPasta(e);
		else if(a.match(/insert/)) setInsert(e);
	}

	var setPosition=function(e,el){
		let elRect=el.getBoundingClientRect();
		let refRect=document.getElementById("tableDiv").getBoundingClientRect();
		let left=((e.clientX+elRect.width/2)>refRect.right?refRect.right-elRect.width:(e.clientX-elRect.width/2)<refRect.left?refRect.left:e.clientX-elRect.width/2)+"px";
		let top=((e.clientY+elRect.height/2)>refRect.bottom?refRect.bottom-elRect.height:(e.clientY-elRect.height/2)<refRect.top?refRect.top:e.clientY-elRect.height/2)+"px";
		[el.style.left,el.style.top]=[left,top];
	}

	var setCut=function(e){
		props.copy();
		props.delete("content");
		/******************copy in main element***************/
	}
	var setDelete=function(e){
		document.getElementById("deletePopMenuLegend").childNodes[0].nodeValue="delete";
		let el=document.getElementById("deletePopMenu");
		el.style.visibility="visible";
		setPosition(e,el);
	}
	var setPasta=function(e){
		props.paste(e);
	}
	var setInsert=function(e){
		document.getElementById("insertPopMenuLegend").childNodes[0].nodeValue="insert";
		let el=document.getElementById("insertPopMenu");
		el.style.visibility="visible";
		setPosition(e,el);
	}
	var setCopy=function(e){
		props.copy();
	}

	return(
		<div id="tableContextMenu" className={style.tableContextMenuDiv} onClick={click}>
			<ul className={style.tableContextMenuUl}>
				<li className={style.tableContextMenuLi}>cut...</li>
				<li className={style.tableContextMenuLi}>copy</li>
				<li className={style.tableContextMenuLi}>pasta</li>
				<li className={style.tableContextMenuLi}>delete...</li>
				<li className={style.tableContextMenuLi}>insert...</li>
			</ul>
		</div>
	);
}






