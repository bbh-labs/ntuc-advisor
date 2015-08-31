var Search = React.createClass({displayName: "Search",
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
			React.createElement("section", null, 
				React.createElement("div", {className: "row"}, 
					React.createElement("h4", null, "Adviser Preferences"), 
					React.createElement("p", null, "Find the advisor you like"), 
					React.createElement("div", {className: "row", style: this.styles.filters}, 
						React.createElement(Search.Field, {onInput: this.onInput, q: this.state.q}), 
						React.createElement(Search.Category, {id: "product", active: this.state.activeCategory == "product", onClick: this.onClick}, "Product"), 
						React.createElement(Search.Category, {id: "age", active: this.state.activeCategory == "age", onClick: this.onClick}, "Age"), 
						React.createElement(Search.Category, {id: "gender", active: this.state.activeCategory == "gender", onClick: this.onClick}, "Gender"), 
						React.createElement(Search.Category, {id: "language", active: this.state.activeCategory == "language", onClick: this.onClick}, "Language"), 
						React.createElement(Search.Category, {id: "interest", active: this.state.activeCategory == "interest", onClick: this.onClick}, "Interest")
					), 
					React.createElement(Search.Options, {filters: this.state.filters, activeCategory: this.state.activeCategory, onOptionClicked: this.onOptionClicked}), 
					React.createElement(Search.Tags, {ref: "tags", filters: this.state.filters, onTagRemoved: this.onTagRemoved}), 
					React.createElement(Search.Result, {filters: this.state.filters, q: this.state.q})
				)
			)
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

Search.Field = React.createClass({displayName: "Field",
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
			React.createElement("div", {style: this.styles.container}, 
				this.state.focus || this.props.q.length > 0 ?
				React.createElement("h5", {onBlur: this.onBlur, style: this.styles.field, onInput: this.props.onInput, contentEditable: true}) :
				React.createElement("h5", {onFocus: this.onFocus, contentEditable: true}, React.createElement("img", {src: "images/search.png"}), " Search")
			)
		)
	},
	onFocus: function(e) {
		this.setState({focus: true});
	},
	onBlur: function(e) {
		this.setState({focus: false});
	},
});

Search.Category = React.createClass({displayName: "Category",
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
			React.createElement("a", {"data-id": this.props.id, href: "", onClick: this.props.onClick, style: m(this.styles.container, this.props.active && this.styles.active)}, 
				React.createElement("img", {"data-id": this.props.id, src: "images/arrow.png", style: m(this.styles.image, this.props.active && this.styles.activeImage)}), 
				React.createElement("h5", {"data-id": this.props.id, style: m(this.props.active && this.styles.activeText)}, this.props.children)
			)
		)
	},
});

Search.Options = React.createClass({displayName: "Options",
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
			React.createElement("div", {style: m(this.styles.container, this.props.activeCategory != null && this.styles.active)}, 
				this.optionElements("age", activeCategory), 
				this.optionElements("gender", activeCategory), 
				this.optionElements("language", activeCategory), 
				this.optionElements("interest", activeCategory), 
				this.optionElements("product", activeCategory)
			)
		)
	},
	optionElements: function(category, activeCategory) {
		return React.createElement("div", {style: this.styles.optionContainer}, 
			CATEGORIES[category].map(function(v, i) {
				return React.createElement(Search.Options.Item, {key: category+i, show: category == activeCategory, filters: this.props.filters, category: category, option: i, onOptionClicked: this.props.onOptionClicked}, v)
			}.bind(this))
		)
	},
});

Search.Options.Item = React.createClass({displayName: "Item",
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
			React.createElement("a", {onClick: this.onClick, href: "", style: m(this.styles.container, this.isSelected() && this.styles.selected, this.props.show && this.styles.show)}, 
				React.createElement("h6", {style: this.styles.text}, 
					this.props.children
				)
			)
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

Search.Tags = React.createClass({displayName: "Tags",
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
			React.createElement("ul", null)
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

Search.Result = React.createClass({displayName: "Result",
	styles: {
		container: {
			minHeight: "400px",
		},
	},
	render: function() {
		var advisers = this.search();
		return (
			React.createElement("ul", {className: "small-block-grid-5", style: this.styles.container}, 
				advisers.map(function(a) {
					return React.createElement(Search.Result.Item, {adviser: a})
				})
			)
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

Search.Result.Item = React.createClass({displayName: "Item",
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
			React.createElement("li", {style: this.styles.container}, 
				React.createElement("h5", null, adviser.name), 
				React.createElement("div", {style: this.styles.imageContainer, onMouseOver: this.onMouseOver, onMouseOut: this.onMouseOut}, 
					React.createElement("img", {src: adviser.avatar, style: this.styles.image}), 
					React.createElement("div", {style: m(this.styles.overlay, this.state.hover && this.styles.hoverOverlay)}, 
						React.createElement("h5", {style: this.styles.overlayText}, adviser.shortDescription)
					)
				), 
				React.createElement("a", {style: this.styles.button, onClick: function(e) { e.preventDefault(); }, href: ""}, "Chat")
			)
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
