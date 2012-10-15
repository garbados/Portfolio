var defs = defs || {}, 			// definitions
	app = app || {}, 			// instances
	helpers = helpers || {}; 	// useful functions and constants

/*
  __  __  ____  _____  ______ _       _____ 
 |  \/  |/ __ \|  __ \|  ____| |     / ____|
 | \  / | |  | | |  | | |__  | |    | (___  
 | |\/| | |  | | |  | |  __| | |     \___ \ 
 | |  | | |__| | |__| | |____| |____ ____) |
 |_|  |_|\____/|_____/|______|______|_____/ 
*/

defs.Page = Backbone.Model.extend({
	initialize: function() {
		if (!this.get("url"))	this.set({url: "#/" + this.get('id')});
		if (!this.get("id")) 	this.set({id: this.get('title')})
	}
});

/* 
   _____ ____  _      _      ______ _____ _______ _____ ____  _   _  _____ 
  / ____/ __ \| |    | |    |  ____/ ____|__   __|_   _/ __ \| \ | |/ ____|
 | |   | |  | | |    | |    | |__ | |       | |    | || |  | |  \| | (___  
 | |   | |  | | |    | |    |  __|| |       | |    | || |  | | . ` |\___ \ 
 | |___| |__| | |____| |____| |___| |____   | |   _| || |__| | |\  |____) |
  \_____\____/|______|______|______\_____|  |_|  |_____\____/|_| \_|_____/ 
*/

defs.PageList = Backbone.Collection.extend({
	model: defs.Page,
	url: '/api/v1/pages',
	initialize: function() {
		// this.bind('all', function() {console.log(arguments);}); // uncomment to log any/all events
		if (!this.models) {
			console.log("Uh oh. Had to fetch pages.");
			this.fetch();
		}
	},
	get_folder: function(folder) {
		return this.filter(function(page) {
			return (page.id.indexOf("pages/" + folder) === 0);
		});
	},
	get_projects: function() {
		return this.get_folder("projects");
	},
	get_etc: function() {
		return this.get_folder("etc")
	},
	get_stories: function() {
		return this.get_folder("stories");
	},
	get_games: function() {
		return this.get_folder("games");
	},
});

/*
 __      _______ ________          _______ 
 \ \    / /_   _|  ____\ \        / / ____|
  \ \  / /  | | | |__   \ \  /\  / / (___  
   \ \/ /   | | |  __|   \ \/  \/ / \___ \ 
    \  /   _| |_| |____   \  /\  /  ____) |
     \/   |_____|______|   \/  \/  |_____/ 
                                           
*/

defs.PageView = Backbone.View.extend({
	el: $('#detail'),
	template: _.template($('#page-template').html()),
	initialize: function(options) {
		this.model = (options && options.model) || {};
	},
	render: function(model) {
		if (model) this.model = model;
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	}
});

defs.ItemView = Backbone.View.extend({
	tagName: "li",
	template: _.template($('#item-template').html()),
	initialize: function(options) {
		this.model = options.model;
		this.$el.tooltip({
			placement: 'bottom',
			title: this.model.get("summary")
		});
	},
	render: function() {
		this.$el.html(this.template(this.model.toJSON()));
		return this;
	},
});

defs.ListView = Backbone.View.extend({
	initialize: function(options) {
		this.collection = (options && options.collection) || new defs.PageList;
		this.columns = ['stories', 'games', 'projects', 'etc'];
		this.render();
	},
	render: function() {
		var self = this;
		self.columns.forEach(function(column) {
			self[column] = $('.'+column+' ul');
			self.collection["get_"+column]().forEach(function(item) {
				var view = new defs.ItemView({model: item});
				self[column].append(view.render().el);
			});
		});
	}
});

/*
  _____   ____  _    _ _______ ______ _____   _____ 
 |  __ \ / __ \| |  | |__   __|  ____|  __ \ / ____|
 | |__) | |  | | |  | |  | |  | |__  | |__) | (___  
 |  _  /| |  | | |  | |  | |  |  __| |  _  / \___ \ 
 | | \ \| |__| | |__| |  | |  | |____| | \ \ ____) |
 |_|  \_\\____/ \____/   |_|  |______|_|  \_\_____/ 
*/

defs.Router = Backbone.Router.extend({
	routes: {
		'*page': 'showPage'
	},
	initialize: function(options) {
		this.pages = (options && options.pages) || helpers.pages || {};
		this.pagelist = (options && options.pagelist) || new defs.PageList(this.pages);
		this.listview = (options && options.listview) || new defs.ListView({collection: this.pagelist});
		this.pageview = (options && options.pageview) || new defs.PageView();
		this.main = $('#main');
		this.detail = $('#detail');
	},
	showPage: function(page) {
		if (page) {
			var model = this.pagelist.get(page);
			if (model) {
				this.pageview.render(model);
				this.main.slideUp("fast");
				this.detail.slideDown("fast");
			} else {
				console.log("notfound");
				// notfound
			}
		} else {
			this.detail.slideUp("fast");
			this.main.slideDown("fast");
		}
	}
});

// BEGIN
$(function(){
	app.Router = new defs.Router();
  	Backbone.history.start();
});