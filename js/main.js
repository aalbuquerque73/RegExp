requirejs.config({
    baseUrl: 'js',
    
    paths: {
    	jquery: 'lib/jquery-2.1.0',
    	underscore: 'lib/underscore',
    	handlebars: 'lib/handlebars-v1.3.0',
    	template: 'lib/jquery-tmpl',
    	knockout: 'lib/knockout-3.0.0',
    	mapping: 'lib/knockout.mapping-2.0',
    	backbone: 'lib/backbone',
    	localstorage: 'lib/backbone.localStorage',
    	sammy: 'lib/sammy',
    	utils: 'lib/utils',
    	
    	app: 'app'
    },
    
    shim: {
    	template: {
    		deps: ['jquery'],
    		exports: "jQuery.fn.tmpl"
    	},
    	'libs/underscore': {
            exports: '_'
        },
        'libs/backbone': {
            deps: ['libs/underscore', 'libs/jquery'],
            exports: 'Backbone'
        },
    	utils: {
    		exports: 'Utils'
    	},
    	app: {
    		deps: ["knockout", "list"],
    		exports: "app"
    	}
    }
});

requirejs(['app'],
function(app) {
	app.start();
});