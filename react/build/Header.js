var Header = React.createClass({displayName: "Header",
	styles: {
		container: {
			width: "100%",
			height: "400px",
			background: "url(images/header_bg.jpg) center / cover",
			padding: "16px",
		},
		label: {
			margin: "50px auto",
		},
		button: {
			backgroundColor: "#F7941E",
		},
	},
	render: function() {
		return (
			React.createElement("header", {style: this.styles.container}, 
				React.createElement("div", {className: "row"}, 
						React.createElement("img", {src: "images/logo.png", width: "200", height: "100"})
				), 
				React.createElement("div", {className: "row"}, 
					React.createElement("div", {style: this.styles.label, className: "small-6 columns"}, 
						React.createElement("h1", null, "ADVISER CONNECT"), 
						React.createElement("h5", null, "Whether it's at home or on the go, chatting with a financial planner has never been easier."), 
						React.createElement("button", {style: this.styles.button}, "Submit an enquiry online")
					)
				)
			)
		)
	},
});
