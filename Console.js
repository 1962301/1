import React from 'react';
import {connect} from"react-redux";
import {mapStateToProps_Console} from "./store.js";

class Console extends React.Component{
	constructor(props){
		super(props);
	}


	getInfo(){
		return this.props.info.reduce((acc,item)=>{
			acc.push(<p style={{wordWrap:"break-word",margin:"0px",color:item.type=="error"?"red":"black"}}>>>{item.info}</p>);
			return acc;
		},[]);
	}

	render(){
		return(
			<div id="consoleDiv" style={{width:"100%",height:"100px",overflow:"auto",position:"relative",border:"1px inset",margin:"3px"}}>
				{this.getInfo()}
			</div>
		);
	}
}

export default connect(mapStateToProps_Console)(Console);