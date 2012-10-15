var app = app || {},
	pages = pages || {};

$(function () {
	//
	// MODELS
	//

	var Page = Backbone.Model.extend({
		defaults: {
			meta: {},
			content: ''
		}
	});
	
	//
	// COLLECTIONS
	//

	var PageList = Backbone.Collection.extend({
		model: Page,
		initialize: function(options) {
			// get all pages
			// create models for each page
			// chillax
		},
		get_projects: function() {
			// return only the projects
		},
		get_games: function() {
			// return only the games
		},
		get_stories: function() {
			// return only the stories
		}
	});

	//
	// VIEWS
	//
	
	var ListView = Backbone.View.extend({
		initialize: function(options) {
			this.template = _.template($(options.template).html());
			this.render();
		},
		render: function() {
			this.$el.html(this.template())
		}
	});

	var DetailView = Backbone.View.extend({
		initialize: function(options) {
			this.data = options.data || {};
			this.template = _.template($('#page').html());
			this.render();
		},
		render: function() {
			this.$el.html(this.template(this.data));
		}
	});

	//
	// ROUTER
	//

	var Router = Backbone.Router.extend({
		routes: {
			'projects':'projects',
			'games':'games',
			'stories':'stories',
			'about': 'about',
			"*action":'default'
		},
		initialize: function(options) {
			this.main = (options && options.main) || $('#main');
			this.default = new ListView({template: '#default'});
			this.projectlist = new ListView({template: '#project'});
			this.gamelist = new ListView({template: '#game'});
			this.storylist = new ListView({template: '#story'});
			this.about = new ListView({template: '#about'});
			this.notfound = new ListView({template: '#notfound'});
		},
		switchTo: function(target) {
			this.main.html(target);
		},
		projects: function() {this.switchTo(this.projectlist.el);},
		games: function() {this.switchTo(this.gamelist.el);},
		stories: function() {this.switchTo(this.storylist.el);},
		about: function() {this.switchTo(this.about.el);},
		default: function(page) {
			if (page) {
				if (pages[page]) {
					// show page
					this.switchTo(new DetailView({data: pages[page]}).el);
				} else {
					// 404
					this.switchTo(this.notfound.el);
				}
			} else {
				// homepage
				this.switchTo(this.default.el);
			}
		}
	});
	app.Router = new Router();
  	Backbone.history.start();
});