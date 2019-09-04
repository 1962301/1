import {createStore,combineReducers} from 'redux';
import {pathToJSON} from "./Func.js";
//********* file IS ONLYFOR TEST
var infoLimit=150;
export let file={
		otherParameters:{
			waitForNextCandle:"false"
		},
		entry:{t:"1"},
		1:{type:"if",condition:"",t:"",f:"",action:""},	//t:[11],f:[2] means if condition true goto 11 otherwise go to 2
	};


let reducer=(
		state={
			fileSys:{},		//object version filesys
			fileSysArr:[],	//array  version filesys
			hasLogin:"false",
			userName:"",
			conFileName:"",
			conFile:file,
			activeID:"1",
			dataFileName:"",
			data:{
				value:[],
				datetime:[],
				volume:[],
				id:[]
			},
			result:[],
			info:[],		//info format [{type:"",info:""}]  type has two values: error, info
			echartOption:{
				startValue:0,
				endValue:100,
				coord:[]
			}
		},
		action
	)=>{
		function changeContent(id,content,type){
			id=parseInt(id)?id:id.slice(3);
			let tempFile=Object.assign({},state.conFile);
			let temp=Object.assign({},tempFile[id]);
			temp[type]=action.content;
			tempFile[id]=temp;
			return tempFile;
		}

		function getNewState(info){
			let newState=Object.assign({},state);
			Object.keys(info).forEach(key=>{
				newState[key]=info[key];
			});
			return newState;
		}

		function getNewInfo(addInfo){   //addInfo is an arr;
			let totalLength=state.info.length+addInfo.length;
			return state.info.slice(totalLength-infoLimit<=0?0:totalLength-infoLimit).concat(addInfo.slice(addInfo.length>=infoLimit?addInfo.length-infoLimit:0));
		}

		switch(action.type){
			case "LOGIN_STATUS":
				return getNewState({hasLogin:action.hasLogin,userName:action.userName,fileSysArr:action.fileSysArr,fileSys:pathToJSON(action.fileSysArr)});
			case "CONDITION_CHANGE":
				return getNewState({conFile:changeContent(action.activeID,action.content,"condition"),activeID:action.activeID});
			case "ACTIVEID_CHANGE":
				return getNewState({activeID:action.activeID})
			case "CONFILE_CHANGE":
				return getNewState({conFile:action.conFile,activeID:action.activeID});
			case "ACTION_CHANGE":
				return getNewState({conFile:changeContent(action.activeID,action.content,"action"),activeID:action.activeID});
			case "OTHERPARAMETERS_CHANGE":
				return getNewState({conFile:action.conFile});
			case "DATACHANGE":
				return getNewState({dataFileName:action.dataFileName,data:action.data,echartOption:action.echartOption});
			case "CONFILENAME_CHANGE":
				return getNewState({conFileName:action.conFileName});
			case "FILESYS_CHANGE":
				return getNewState({fileSysArr:action.fileSysArr,fileSys:pathToJSON(action.fileSysArr)});
			case "RESULT_CHANGE":
				return getNewState({result:action.result});
			case "INFO_ADD":
				return getNewState({info:getNewInfo(action.info)});
			case "DATAFILENAME_CHANGE":
				return getNewState({dataFileName:action.dataFileName});
			case "CONFILECHANGE_EXPLORER":
				return getNewState({conFileName:action.conFileName,conFile:action.conFile});
			default:
				return state;
		}
} 

export function mapStateToProps(state){
	return {hasLogin:state.hasLogin,conFile:state.conFile};
}
export function mapStateToProps_Login(state){
	return {hasLogin:state.hasLogin,userName:state.userName};
}
export function mapStateToProps_Explorer(state){
	return {hasLogin:state.hasLogin,conFile:state.conFile,fileSysArr:state.fileSysArr,fileSys:state.fileSys,conFileName:state.conFileName,dataFileName:state.dataFileName,userName:state.userName};
}
export function mapStateToProps_Logical(state){
	return {conFileName:state.conFileName,conFile:state.conFile,activeID:state.activeID,fileSys:state.fileSys,result:state.result};
}
export function mapStateToProps_Echart(state){
	return {dataFileName:state.dataFileName,data:state.data,echartOption:state.echartOption};
}
export function mapStateToProps_Result(state){
	return {dataFileName:state.dataFileName,result:state.result,echartOption:state.echartOption};
}
export function mapStateToProps_Console(state){
	return {info:state.info};
}



export function setLoginStatus(status,userName,fileSysArr){
	return {type:"LOGIN_STATUS",hasLogin:status,userName:userName,fileSysArr:fileSysArr};
}
export function setFileSys_Explorer(fileSysArr){
	return {type:"FILESYS_CHANGE",fileSysArr:fileSysArr};
}
export function setConFile_Explorer(fileName,file){
	return {type:"CONFILECHANGE_EXPLORER",conFileName:fileName,conFile:file};
}


export function setConFileName_Logical(conFileName){
	return {type:"CONFILENAME_CHANGE",conFileName:conFileName};
}
export function setCondition_Logical(id,content){
	return {type:"CONDITION_CHANGE",activeID:id,content:content};
}
export function setAction_Logical(id,content){
	return {type:"ACTION_CHANGE",activeID:id,content:content};
}
export function setActiveID_Logical(id){
	return {type:"ACTIVEID_CHANGE",activeID:id};
}
export function setConFile_Logical(id,conFile){
	return {type:"CONFILE_CHANGE",activeID:id,conFile:conFile};
}
export function setConFile_OtherParameters(conFile){
	return {type:"OTHERPARAMETERS_CHANGE",conFile:conFile};
}
export function setData_Echart(dataFileName,data,echartOption){
	return {type:"DATACHANGE",dataFileName:dataFileName,data:data,echartOption:echartOption};
}
export function setDataFileName(dataFileName){
	return {type:"DATAFILENAME_CHANGE",dataFileName:dataFileName};
}

export function setResult(resultArr){
	return {type:"RESULT_CHANGE",result:resultArr};
}
export function addInfo(infoArr){			//infoArr=[{type:...,info:...}] when type=error, font color=red, anyother type, font color= black. type can be any word
	return {type:"INFO_ADD",info:infoArr};
}

export const store=createStore(reducer);

