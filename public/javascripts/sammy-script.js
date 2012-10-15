var profileTemplates = function(app) {
	this.helpers = {
		project: $('script#project'),
		game: $('script#game'),
		story: $('script#story'),
		about: $('script#about'),
	}
};

var app = Sammy('#main', function() {
	// plugins
	this.use('Mustache');
	this.use('profileTemplates');

	// routes
	this.get('#/', function() {

	});
	this.get('#/projects', function() {
		this.load('projects.json')
			.renderEach('project.mustache')
			.swap();
	});
	this.get('#/games', function() {});
	this.get('#/games/:name', function() {});
	this.get('#/stories', function() {});
	this.get('#/stories/:name', function() {});
	this.get('#/about', function() {});
	this.get('#/random', function() {});
});

// once the window is ready, run the app
$(function() {app.run});