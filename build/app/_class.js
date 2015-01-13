import * from 'jquery' as jQuery;

class Portfolio extends {
	about() {
		return 'Hi. I\'m Craig. I\'m a Front-end Web Developer / Consultant primarily interested in JavaScript' + 
			'development, together with HTML5/CSS3 and emerging WHATWG standards. I\'m highly proficient in ' + 
			'Node.JS and SPA development, and have a good working knowledge of several key web languages and frameworks.';
	}

	skills() {
		return [
			{
				category: 'JavaScript & Libraries',
				skills: [
					'ES3', 'ES5', 'ES6', 'Node.js', 'jQuery', '(+UI)', 'RequireJS', 'Bootstrap', 
					'Durandal', 'Vue.js', 'Knockout.js', 'Backbone.js', '(+Marionette)', 
					'Raphael', 'D3.js'
				]
			},
			{
				category: 'Markup & Styling',
				skills: [
					'HTML5', 'CSS3', 'LESS', 'JSON', 'SVG', 'XML', 'Jade', 'Markdown', 
					'Handlebars', 'Mustache', 'Bootstrap', 'FontAwesome', 'Foundation'
				]
			},
			{
				category: 'Development & Build tools',
				skills: [
					'Grunt', 'Gulp', 'Brunch.io', 'Webpack', 'NPM', 'Bower', 'JSPM', 
					'Karma', 'QUnit', 'Git', 'SVN', 'TFS', 'MySQL', 'MongoDB', 'Redis', 
					'Apache', 'IIS', 'Selenium'
				] 
			},
			{
				category: 'Languages & Other tools',
				skills: [
					'HTML5 APIs', 'Google APIs', 'Photoshop', 'Illustrator', 'OpenLayers', 
					'TypeScript', 'CoffeeScript', 'PHP', 'Python', 'C#', 'Java'
				]
			}
		];
	}

	plugins() {
		return [
			{
				name: 'qTip2',
				tagline: 'Pretty Powerful Tooltips',
				description: 'qTip2 is the second generation of the advanced qTip plugin for the ever popular jQuery framework.',
				website: 'http://qtip2.com',
				github: 'http://github.com/qTip2/qTip2'
			},
			{
				name: 'qTip',
				tagline: 'The jQuery tooltip plugin',
				description: 'qTip is an advanced tooltip plugin for the ever popular jQuery JavaScript framework, allowing the creation of stylish tooltips.',
				website: 'http://qtip1.com/',
				github: 'http://github.com/craga89/qtip'
			},
			{
				name: 'ui.draggable.exclusive',
				tagline: 'jQuery UI',
				description: 'Adds exclusivity support to jQuery UI\'s draggable component, ensuring only one droppable has its drop event fired.',
				website: 'http://craga89.github.io/ui.draggable.exclusive',
				github: 'http://github.com/craga89/ui.draggable.exclusive'
			},
			{
				name: 'gulp-watch-less',
				tagline: 'Gulp plugin',
				description: 'A gulp plugin which watches .less files and their @imports using the gulp-watch endless stream task.',
				github: 'http://github.com/craga89/gulp-watch-less'
			}
		]
	}

	who() {
		return [
			'Mozilla', 'ASOS', 'Urban Dictionary', 
			'Skrill', 'Lloyds TSB', 'models.com', 
			'desk.com'
		];
	}

	contact(type) {
		switch(type) {
			case 'email':
				return 'craig@craigsworks.com';

			case 'telephone':
				return '(+44) 7878 062 458';

			default:
				return 'Invalid contact method!';
		}
	}
}