exports.config =
	paths:
		public: '../'
		
	files:
		javascripts:
			joinTo:
				'js/app.js': /^app/
				'js/vendor.js': /^(vendor|bower_components)/

		stylesheets:
			defaultExtension: 'less'
			joinTo:
				'css/app.css': /^app/
				'css/vendor.css': /^vendor/
			order:
				before: [
					'vendor/styles/main.less'
				]
				
		templates:
			defaultExtension: 'jade'
			joinTo:
				'js/templates.js': /.+\.jade$/

	plugins:
		# Image optimizer
		path: 'img/'

		# Jade
		jade:
			pretty: true

		# LiveReload
		autoReload:
			enabled:
				css: on
				js: on
				assets: on
		
		# Auto Prefixer
		autoprefixer:
			browsers: ["last 2 versions", "ie 8", "ie 9"]
			cascade: false

	# No CommonJS etc.
	modules:
		wrapper: false
		definition: false

	# Optimize outputs
	optimize: false
	minify: true

	# `watch` server
	server:
		port: 3333
