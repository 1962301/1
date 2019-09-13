import {setLoginStatus, mapStateToProps_Login} from "./store.js"
import {connect} from 'react-redux'
import React from 'react';
import {ajaxSend} from "./Func.js";


class LoginForm extends React.Component{
	constructor(props){
		super(props);
	}

	componentDidMount(){
		ajaxSend("GET","/hasLogin",(response)=>{this.props.setLoginStatus(response.status,response.userName,response.fileSys)});
	}

	login=(e)=>{
		if(this.props.hasLogin=="false"){
			let [username,password]=[document.getElementById("username").value.trim(),document.getElementById("password").value.trim()];
			if(username!=""&&password!=""){
				ajaxSend("POST","/Login?username="+username+"&password="+password,(response)=>{
					this.props.setLoginStatus(response.status,response.userName,response.fileSys);
				});
			}
			else if(username=="") document.getElementById("username").focus();
			else if(password=="") document.getElementById("password").focus();
		}
		else{
			ajaxSend("GET","/Logout",(response)=>{this.props.setLoginStatus("false","",response.fileSys)})
		}
	}

	getLoginView=()=>{
		return (
			<div>
				<table><tbody>
					<tr><td>UserName:</td><td><input id="username" placeholder="UserName"/></td></tr>
					<tr><td>PassWord:</td><td><input id="password" type="passWord" placeholder="PassWord"/></td></tr>
				</tbody></table>
        		<button onClick={this.login}>Login</button>
			</div>
		);
	}

	getWelcomeView=()=>{
		return (
			<table><tbody>
				<tr><td>Welcome: {this.props.userName}</td></tr>
				<tr><td><button onClick={this.login}>Logout</button></td></tr>
			</tbody></table>
		)
	}

	render(){ return this.props.hasLogin=="true"?this.getWelcomeView():this.getLoginView(); }
}

export default connect(mapStateToProps_Login,{setLoginStatus})(LoginForm);
