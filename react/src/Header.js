var Header = React.createClass({
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
			<header style={this.styles.container}>
				<div className="row">
						<img src="images/logo.png" width="200" height="100" />
				</div>
				<div className="row">
					<div style={this.styles.label} className="small-6 columns">
						<h1>ADVISER CONNECT</h1>
						<h5>Whether it's at home or on the go, chatting with a financial planner has never been easier.</h5>
						<button style={this.styles.button}>Submit an enquiry online</button>
					</div>
				</div>
			</header>
		)
	},
});
