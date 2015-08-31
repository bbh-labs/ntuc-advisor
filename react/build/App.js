var App = React.createClass({displayName: "App",
	render: function() {
		return (
			React.createElement("section", null, 
				React.createElement(Header, null), 
				React.createElement(Description, null), 
				React.createElement(Search, null)
			)
		)
	},
});

React.render(React.createElement(App, null), document.getElementById("root"));
