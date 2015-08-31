var Search = React.createClass({
	styles: {
		filters: {
			margin: "0px",
		},
	},
	getInitialState: function() {
		return {
			activeCategory: null,
			filters: {},
			q: "",
		};
	},
	render: function() {
		return (
			<section>
				<div className="row">
					<h4>Adviser Preferences</h4>
					<p>Find the advisor you like</p>
					<div className="row" style={this.styles.filters}>
						<Search.Field onInput={this.onInput} q={this.state.q} />
						<Search.Category id="product" active={this.state.activeCategory == "product"} onClick={this.onClick}>Product</Search.Category>
						<Search.Category id="age" active={this.state.activeCategory == "age"} onClick={this.onClick}>Age</Search.Category>
						<Search.Category id="gender" active={this.state.activeCategory == "gender"} onClick={this.onClick}>Gender</Search.Category>
						<Search.Category id="language" active={this.state.activeCategory == "language"} onClick={this.onClick}>Language</Search.Category>
						<Search.Category id="interest" active={this.state.activeCategory == "interest"} onClick={this.onClick}>Interest</Search.Category>
					</div>
					<Search.Options filters={this.state.filters} activeCategory={this.state.activeCategory} onOptionClicked={this.onOptionClicked} />
					<Search.Tags ref="tags" filters={this.state.filters} onTagRemoved={this.onTagRemoved} />
					<Search.Result filters={this.state.filters} q={this.state.q} />
				</div>
			</section>
		)
	},
	onClick: function(e) {
		var activeCategory = this.state.activeCategory;
		if (activeCategory == e.target.dataset.id) {
			this.setState({activeCategory: null});
		} else {
			this.setState({activeCategory: e.target.dataset.id});
		}
		return e.preventDefault();
	},
	onOptionClicked: function(category, option) {
		var fs = this.state.filters;
		var fc = fs[category];
		if (!fc) {
			fc = {};
		}

		if (fc[option]) {
			delete fc[option];
			if (Object.keys(fc).length == 0) {
				delete fs[category];
			}
			this.refs.tags.removeTag(category, option);
		} else {
			fc[option] = true;
		}

		if (Object.keys(fc).length > 0) {
			fs[category] = fc;
		}

		this.setState({filters: fs});
		this.refs.tags.updateTags();
	},
	onInput: function(e) {
		this.setState({q: e.target.textContent});
		e.preventDefault();
	},
	onTagRemoved: function(tag) {
		var filters = this.state.filters;
		for (var cat in filters) {
			var catFilter = filters[cat];
			for (var i in catFilter) {
				if (tag == CATEGORIES[cat][i]) {
					delete filters[cat][i];
					if (Object.keys(filters[cat]).length == 0) {
						delete filters[cat];
					}
				}
			}
		}
		this.setState({filters: filters});
	},
});

Search.Field = React.createClass({
	styles: {
		container: {
			display: "inline-block",
			padding: "0 8px",
			border: "2px solid #808080",
			marginTop: "8px",
			marginRight: "8px",
			minWidth: "200px",
		},
		field: {
			outline: "none",
		},
		focus: {
		},
	},
	getInitialState: function() {
		return {focus: false};
	},
	render: function() {
		return (
			<div style={this.styles.container}>{
				this.state.focus || this.props.q.length > 0 ?
				<h5 onBlur={this.onBlur} style={this.styles.field} onInput={this.props.onInput} contentEditable></h5> :
				<h5 onFocus={this.onFocus} contentEditable><img src="images/search.png" /> Search</h5>
			}</div>
		)
	},
	onFocus: function(e) {
		this.setState({focus: true});
	},
	onBlur: function(e) {
		this.setState({focus: false});
	},
});

Search.Category = React.createClass({
	styles: {
		container: {
			display: "inline-block",
			background: "white",
			position: "relative",
			marginTop: "8px",
			marginRight: "8px",
			padding: "0 8px",
			border: "2px solid #808080",
			transition: "background .4s",
			minWidth: "150px",
		},
		image: {
			position: "absolute",
			top: 12,
			right: 8,
			transition: "transform .2s",
		},
		active: {
			background: "#F7941E",
		},
		activeText: {
			color: "white",
		},
		activeImage: {
			transform: "rotate(90deg)",
		},
	},
	render: function() {
		return (
			<a data-id={this.props.id} href="" onClick={this.props.onClick} style={m(this.styles.container, this.props.active && this.styles.active)}>
				<img data-id={this.props.id} src="images/arrow.png" style={m(this.styles.image, this.props.active && this.styles.activeImage)} />
				<h5 data-id={this.props.id} style={m(this.props.active && this.styles.activeText)}>{this.props.children}</h5>
			</a>
		)
	},
});

Search.Options = React.createClass({
	styles: {
		container: {
			background: "#404040",
			marginTop: "8px",
			maxHeight: "0px",
			transition: "max-height .4s",
		},
		active: {
			maxHeight: "999px",
		},
	},
	render: function() {
		var activeCategory = this.props.activeCategory;
		return (
			<div style={m(this.styles.container, this.props.activeCategory != null && this.styles.active)}>
				{this.optionElements("age", activeCategory)}
				{this.optionElements("gender", activeCategory)}
				{this.optionElements("language", activeCategory)}
				{this.optionElements("interest", activeCategory)}
				{this.optionElements("product", activeCategory)}
			</div>
		)
	},
	optionElements: function(category, activeCategory) {
		return <div style={this.styles.optionContainer}>{
			CATEGORIES[category].map(function(v, i) {
				return <Search.Options.Item key={category+i} show={category == activeCategory} filters={this.props.filters} category={category} option={i} onOptionClicked={this.props.onOptionClicked}>{v}</Search.Options.Item>
			}.bind(this))
		}</div>
	},
});

Search.Options.Item = React.createClass({
	styles: {
		container: {
			display: "none",
			opacity: 0,
			padding: "8px",
			margin: "8px",
			color: "#F7941E",
			border: "2px solid #f0f0f0",
			transition: "border .2s, opacity .4s",
		},
		selected: {
			border: "2px solid #F7941E",
		},
		show: {
			display: "inline-block",
			opacity: 1,
		},
		text: {
			color: "#f0f0f0",
		},
	},
	render: function() {
		return (
			<a onClick={this.onClick} href="" style={m(this.styles.container, this.isSelected() && this.styles.selected, this.props.show && this.styles.show)}>
				<h6 style={this.styles.text}>
					{this.props.children}
				</h6>
			</a>
		)
	},
	onClick: function(e) {
		this.props.onOptionClicked(this.props.category, this.props.option);
		e.preventDefault();
	},
	isSelected: function() {
		if (!this.props.filters[this.props.category]) {
			return false;
		}
		return this.props.filters[this.props.category][this.props.option] == true;
	},
});

Search.Tags = React.createClass({
	componentDidMount: function() {
		$(this.getDOMNode()).tagit({
			beforeTagRemoved: function(evt, ui) {
				this.props.onTagRemoved(ui.tagLabel);
			}.bind(this),
		});
	},
	render: function() {
		var filters = this.props.filters;
		return (
			<ul></ul>
		)
	},
	updateTags: function() {
		var root = this.getDOMNode();
		var filters = this.props.filters;

		for (var cat in filters) {
			var catFilter = filters[cat];
			for (var i in catFilter) {
				if (catFilter[i]) {
					$(root).tagit("createTag", CATEGORIES[cat][i]);
				}
			}
		}
	},
	removeTag: function(category, option) {
		var root = this.getDOMNode();
		var filters = this.props.filters;

		$(root).tagit("removeTagByLabel", CATEGORIES[category][option]);
	}
});

Search.Result = React.createClass({
	styles: {
		container: {
			minHeight: "400px",
		},
	},
	render: function() {
		var advisers = this.search();
		return (
			<ul className="small-block-grid-5" style={this.styles.container}>{
				advisers.map(function(a) {
					return <Search.Result.Item adviser={a} />
				})
			}</ul>
		)
	},
	search: function() {
		var filters = this.props.filters;
		if (this.props.q.length == 0 && Object.keys(filters).length == 0) {
			return ADVISERS;
		}

		var advisers = [];
		var filteredAdvisers = [];
		for (var a of ADVISERS) {
			var re = new RegExp(this.props.q + ".*", "gi");
			if (a.name.search(re) >= 0) {
				filteredAdvisers.push(a);
			}
		}

		if (Object.keys(filters).length == 0) {
			return filteredAdvisers;
		}
		
		// age
		var ageFilters = filters["age"];
		if (ageFilters) {
			advisers = [];
			for (var i in ageFilters) {
				if (!ageFilters[i]) {
					continue;
				}
				if (i == 0) {
					advisers = findAdvisers(advisers, filteredAdvisers, function(a) {
						return a.age <= 35;
					});
				} else if (i == 1) {
					advisers = findAdvisers(advisers, filteredAdvisers, function(a) {
						return a.age > 35 && a.age <= 45;
					});
				} else if (i == 2) {
					advisers = findAdvisers(advisers, filteredAdvisers, function(a) {
						return a.age > 45 && a.age <= 55;
					});
				} else if (i == 3) {
					advisers = findAdvisers(advisers, filteredAdvisers, function(a) {
						return a.age > 55;
					});
				}
			}
			filteredAdvisers = advisers;
		}

		// gender
		var genderFilters = filters["gender"];
		if (genderFilters) {
			advisers = [];
			for (var i in genderFilters) {
				if (!genderFilters[i]) {
					continue;
				}
				advisers = findAdvisers(advisers, filteredAdvisers, function(a) {
					return a.gender == CATEGORIES.gender[i];
				});
			}
			filteredAdvisers = advisers;
		}

		// language
		var languageFilters = filters["language"];
		if (languageFilters) {
			advisers = [];
			for (var i in languageFilters) {
				if (!languageFilters[i]) {
					continue;
				}
				advisers = findAdvisers(advisers, filteredAdvisers, function(a) {
					return a.language.indexOf(CATEGORIES.language[i]) >= 0;
				});
			}
			filteredAdvisers = advisers;
		}

		// interest
		var interestFilters = filters["interest"];
		if (interestFilters) {
			advisers = [];
			for (var i in interestFilters) {
				if (!interestFilters[i]) {
					continue;
				}
				advisers = findAdvisers(advisers, filteredAdvisers, function(a) {
					return a.interest.indexOf(CATEGORIES.interest[i]) >= 0;
				});
			}
			filteredAdvisers = advisers;
		}

		// product
		var productFilters = filters["product"];
		if (productFilters) {
			advisers = [];
			for (var i in productFilters) {
				if (!productFilters[i]) {
					continue;
				}
				advisers = findAdvisers(advisers, filteredAdvisers, function(a) {
					return a.product.indexOf(CATEGORIES.product[i]) >= 0;
				});
			}
		}

		return advisers;
	},
});

Search.Result.Item = React.createClass({
	styles: {
		container: {

		},
		button: {
			display: "block",
			background: "#F7941E",
			color: "#F0F0F0",
			textAlign: "center",
		},
		imageContainer: {
			position: "relative",
		},
		image: {
			position: "relative",
		},
		overlay: {
			position: "absolute",
			background: "rgba(0,0,0,0.5)",
			width: "100%",
			height: "100%",
			top: 0,
			opacity: 0,
			transition: "opacity .4s",
		},
		overlayText: {
			color: "#F7941E",
			margin: "16px",
		},
		hoverOverlay: {
			opacity: 1,
		},
	},
	getInitialState: function() {
		return {hover: false};
	},
	render: function() {
		var adviser = this.props.adviser;
		return (
			<li style={this.styles.container}>
				<h5>{adviser.name}</h5>
				<div style={this.styles.imageContainer} onMouseOver={this.onMouseOver} onMouseOut={this.onMouseOut}>
					<img src={adviser.avatar} style={this.styles.image} />
					<div style={m(this.styles.overlay, this.state.hover && this.styles.hoverOverlay)}>
						<h5 style={this.styles.overlayText}>{adviser.shortDescription}</h5>
					</div>
				</div>
				<a style={this.styles.button} onClick={function(e) { e.preventDefault(); }} href="">Chat</a>
			</li>
		)
	},
	onMouseOver: function(e) {
		this.setState({hover: true});
	},
	onMouseOut: function(e) {
		this.setState({hover: false});
	},
});

function findAdvisers(advisers, filteredAdvisers, compare) {
	for (var a of filteredAdvisers) {
		if (compare(a) && advisers.indexOf(a) == -1) {
			advisers.push(a);
		}
	}
	return advisers;
}
