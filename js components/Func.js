import {webAddress} from "./Setting.js"

export var ajaxSend=function(method,uri,f,data,headers,f2){
		let xhttp=new XMLHttpRequest();
		xhttp.withCredentials=true;
		xhttp.onreadystatechange=function(){
			if(xhttp.readyState==4&&xhttp.status==200){
				let response=JSON.parse(xhttp.responseText);
				if(f) f(response);
			}
			else{
				console.log(xhttp.readyState+" "+xhttp.status);
			}
		};
		xhttp.open(method,webAddress+uri,true);
		xhttp.setRequestHeader("Content-Type", "application/json");
		if(headers) Object.keys(headers).forEach(k=>xhttp.setRequestHeader(k,headers[k]));
		if(data) xhttp.send(data);
		else xhttp.send();
	}

export var pathToJSON=function(pathArr){
	return pathArr.reduce((acc,item)=>{
		item.frontfile.split("/").reduce((tempAcc,tempItem,itemIndex,arr)=>{
			if(itemIndex==arr.length-1) return tempAcc[tempItem]=item.type;
			else return tempAcc[tempItem]&&(typeof tempAcc[tempItem]=="object")?tempAcc[tempItem]:tempAcc[tempItem]={};
		},acc);
		return acc;
	},{})
}

export var getPathArrFromFileSysArr=function(props){
	return props.reduce((acc,item)=>{
		acc.push(item.frontfile);
		return acc;
	},[])
}

export var getEchartOption=function(startValue,endValue,coord){	//startValue int, endValue int, coord []
	return {startValue:startValue,endValue:endValue,coord:coord};
}

export var insertData=function(item,obj){
	obj.id.push(item.id);
    obj.datetime.push(item.datetime);
    obj.value.push([item.open,item.close,item.high,item.low]);
    obj.volume.push(item.vol);
    return obj;
}

export var formatData=function(rawData){
	return rawData.reduce( (arr,item) => {return insertData(item,arr);}  , {value:[],datetime:[],volume:[],id:[]} );
}

export var dealGetTargetData=function(response,myChart){
	let targetID=parseInt(response[0].targetID);
    let newData=formatData(response.slice(1));
    let numberPoints=myChart.getOption().dataZoom[0].endValue-myChart.getOption().dataZoom[0].startValue;
    let tempArr=newData.id.sort((x,y)=>Math.abs(x-targetID)-Math.abs(y-targetID)).slice(0,numberPoints).sort((x,y)=>{return x-y});
    newData.id.sort((x,y)=>x-y);
    let [startIndex,endIndex]=[newData.id.indexOf(tempArr[0]),newData.id.indexOf(tempArr[tempArr.length-1])];
    let idIndex=newData.id.indexOf(targetID);

    return [newData,getEchartOption(startIndex,endIndex,[idIndex,newData.value[idIndex][2]])];
}

export var formatConsoleInfo=function(obj){
	return Object.keys(obj).reduce((acc,key)=>{
			acc.push({type:key,info:obj[key]});
			return acc;
		},[])
}