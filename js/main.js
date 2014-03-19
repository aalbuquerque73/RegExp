requirejs.config({
    baseUrl: 'js',
    
    paths: {
    	jquery: 'lib/jquery-2.1.0',
    	underscore: 'lib/underscore-min',
    	backbone: 'lib/backbone',
    	localstorage: 'lib/backbone.localStorage',
    	sammy: 'lib/sammy',
    	utils: 'lib/utils',
    	text: 'lib/text-2.0.10',
    	template: 'plugins/template',
    	
    	app: 'app'
    },
    
    shim: {
    	template: {
    		deps: ['jquery', 'underscore'],
    		exports: "T"
    	},
    	'underscore': {
            exports: '_'
        },
    	'backbone': {
    		deps: ['jquery', 'underscore'],
            exports: 'Backbone'
        },
    	utils: {
    		exports: 'Utils'
    	},
    	app: {
    		deps: ['jquery', 'underscore', 'backbone'],
    		exports: "app"
    	}
    }
});

requirejs(['app'],
function(app) {
	app.start();
});