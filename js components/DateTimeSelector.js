import style from "./DateTimeSelector.css";
import React from 'react';
export default function DateTimeSelector(props){
	var datetime={
		date:props.value.split("T")[0],
		hour:props.value.split("T")[1].split(":")[0],
		minute:props.value.split("T")[1].split(":")[1],
		second:props.value.split("T")[1].split(":")[2].split(".")[0],
		millisecond:props.value.split("T")[1].split(".")[1]
	}
	
	function handleChange(e){
		if(e.target.id==="date"){
			if(e.target.value!==datetime.date){
				datetime.date=e.target.value;
				props.setValue(getDateTime());
			}
		}
		else{
			let value=validTimeValue(e.target.id,e.target.value)
			if(datetime[e.target.id]!==value){
				datetime[e.target.id]=value;
				props.setValue(getDateTime());
			}
		}
	}

	function getDateTime(){
		return datetime.date+"T"+datetime.hour+":"+datetime.minute+":"+datetime.second+"."+datetime.millisecond;
	}
	
	function handleTimeKeyDown(e){
		if(e.keyCode>=48&&e.keyCode<=57){
		}
		else if(e.keyCode===37||e.keyCode===38||e.keyCode===39||e.keyCode===40||e.keyCode===8){
		}
		else e.preventDefault();
	}
	
	function handleTimeBlur(e){
		if(e.target.id!=="millisecond"){
			if(e.target.value.length<2){
				datetime[e.target.id]=Array(3-e.target.value.length).join("0")+e.target.value;
				props.setValue(getDateTime());
			}
		}
		else{
			if(e.target.value.length<3){
				datetime[e.target.id]=Array(4-e.target.value.length).join("0")+e.target.value;
				props.setValue(getDateTime());
			}
		}
		
	}

	function handleArrowMouseDown(e){
		e.preventDefault();
	}
	function handleTimeArrowClick(e){
		e.preventDefault();
		if(!props.disabled){
			let id=document.activeElement.id;		
			if(id==="hour"||id==="minute"||id==="second"||id==="millisecond"){
				let v=validTimeValue(id,(parseInt(datetime[id])+(e.target.id==="timeArrowTop"?(datetime[id]==="999"?0:1):parseInt(datetime[id])===0?0:-1)).toString());
				if(datetime[id]!==v){
					datetime[id]=v;
					props.setValue(getDateTime());
				}
			}
		}
	}

	function validTimeValue(id,value){
		if(id!=="millisecond"){
			if(value.length>=3)							value=value.slice(0,2);
			if(id!=="hour"&&parseInt(value)>59)			value="59";
			else if(id==="hour"&&parseInt(value)>23) 	value="23";
		}
		else if(id==="millisecond"){	
			if(value.length>3)							value=value.slice(0,3);
		}
		return value;	
	}



	return(
		<fieldset id="datetimeFieldSet" className={style.datetimeFieldSet} disabled={props.disabled}>
			<input type="date" id="date" className={style.input+" "+style.date} value={datetime.date} onChange={(e)=>handleChange(e)}/>
			<div id="timeOuterDiv" className={style.timeOuterDiv}>
				<input id="hour" 	className={style.input+" "+style.hour+" "+style.timeInput}					type="text" value={datetime.hour}		onBlur={(e)=>handleTimeBlur(e)}	onChange={(e)=>handleChange(e)} onKeyDown={(e)=>handleTimeKeyDown(e)}/>
				<input id="minute" 	className={style.minute+" "+style.timeInput}				type="text" value={datetime.minute}		onBlur={(e)=>handleTimeBlur(e)}	onChange={(e)=>handleChange(e)} onKeyDown={(e)=>handleTimeKeyDown(e)}/>
				<input id="second" 	className={style.second+" "+style.timeInput}				type="text" value={datetime.second}		onBlur={(e)=>handleTimeBlur(e)}	onChange={(e)=>handleChange(e)} onKeyDown={(e)=>handleTimeKeyDown(e)}/>
				<input id="millisecond" 	className={style.millisecond+" "+style.timeInput}	type="text" value={datetime.millisecond}	onBlur={(e)=>handleTimeBlur(e)}	onChange={(e)=>handleChange(e)} onKeyDown={(e)=>handleTimeKeyDown(e)}/>
				<div id="timeArrowDiv"	className={style.timeArrowDiv}>
					<div id="timeArrowTop" 		onMouseDown={(e)=>handleArrowMouseDown(e)}	onClick={(e)=>handleTimeArrowClick(e)}	className={style.timeArrowTop}></div>
					<div id="timeArrowBottom" 	onMouseDown={(e)=>handleArrowMouseDown(e)}	onClick={(e)=>handleTimeArrowClick(e)}	className={style.timeArrowBottom}></div>
				</div>
				<div className={style.timeColon1}>:</div>
				<div className={style.timeColon2}>:</div>
				<div className={style.timeDot}>.</div>
			</div>
		</fieldset>
	)
	

}
