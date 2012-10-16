var app = app || {};

var SectionView = Backbone.View.extend({
	events: {
		"h1 > a" : "showPage"
	},
	initialize: function(options) {
		this.section = options.section;
		this.el = $('.'+options.section);
		this.pages = $(options.section+" > ul > li");
	},
	showPage: function(e) {
		console.log(e.target);
		// this.pages.forEach(function(page) {
		// 	if (page.is(':visible')) page.scrollUp()
		// });
	}
});

var Router = Backbone.Router.extend({
	routes: {
		'*page':'showSection'
	},
	initialize: function(options) {
		this.header = $('header');
		this.nav = $('nav');
		this.main = $('#main');
		this.sections = {
			projects: $('.projects'),
			games: $('.games'),
			stories: $('.stories'),
			etc: $('.etc')
		};
	},
	showSection: function(page) {
		var path = page.split('/'),
			folder,
			page;
		if (path.length > 1) {
			folder = path[0];
			page = path[1];
			if (this.sections[folder] && this.sections[folder][page]) {

			}
		} else {

		}
		for (var sectionKey in this.sections) {
			var section = this.sections[sectionKey];
			if (sectionKey !== page) {
				section.slideUp();
			}
		}
		if(this.sections.hasOwnProperty(page)) {
			if (this.header.is(":visible")) this.header.slideUp();
			this.sections[page].slideDown();
		} else {
			this.header.slideDown();
		}
	}
});

$(function() {
	// $('header').width($(window).width())
	// $('header').height($(window).height() - $('nav').height());
	// $('#header').css('padding-top', $(window).height() / 6)
	app.router = new Router();
  	Backbone.history.start();
});