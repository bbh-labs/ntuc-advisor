var App = React.createClass({
	render: function() {
		return (
			<section>
				<Header />
				<Description />
				<Search />
			</section>
		)
	},
});

React.render(<App />, document.getElementById("root"));
