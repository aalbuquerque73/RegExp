requirejs.config({
    baseUrl: 'js',
    
    paths: {
    	console: "plugins/console",
    	jquery: 'lib/jquery-2.1.0',
    	underscore: 'lib/underscore-min',
    	backbone: 'lib/backbone',
    	localstorage: 'lib/backbone.localStorage',
    	memory: "plugins/memory",
    	sammy: 'lib/sammy',
    	utils: 'lib/utils',
    	text: 'lib/text-2.0.10',
    	template: 'plugins/template',
    	
    	app: 'app'
    },
    
    shim: {
    	console: {
    		exports: "console"
    	},
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

requirejs(['console', 'app'],
function(console, app) {
	app.start();
});