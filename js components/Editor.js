import Editor_ActionArea from "./Editor_ActionArea.js";
import Editor_LogicalArea from "./Editor_LogicalArea.js";
import Editor_textarea from "./Editor_textarea.js";
import style from "./Editor.css";
import React from 'react';

export default function Editor(props){
	let handleTabButton=(e)=>{
		e.preventDefault();
		document.getElementById("Editor_textarea").style.visibility=(e.target.id=="conButton"?"visible":"hidden");
		document.getElementById("Editor_ActionArea").style.visibility=(e.target.id=="actButton"?"visible":"hidden");
	}	
	return(
		<div id="editorDiv" className={style.EditorDiv} >
			<div className={style.logicalAreaDiv}>									
				<Editor_LogicalArea />
			</div>
			<div id="ExpresionDiv">
				<button id="conButton" onClick={handleTabButton}>Condition</button>
				<button id="actButton" onClick={handleTabButton}>Action</button>
				<Editor_textarea />
				<Editor_ActionArea />
			</div>	
		</div>
	)
}




