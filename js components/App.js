import ResizableDiv from "./ResizableDiv.js";
import LoginForm from "./LoginForm";
import ReactDOM from "react-dom";
import {store} from "./store.js";
import {Provider} from "react-redux";
import React from "react";


ReactDOM.render(
	<Provider store={store}><ResizableDiv /></Provider>, document.getElementById("ResizableDiv")
);
ReactDOM.render(
	<Provider store={store}><LoginForm /></Provider>, document.getElementById("LoginForm")
);