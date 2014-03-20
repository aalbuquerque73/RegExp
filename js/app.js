/*
 * Application Layer
 */
define([
        'jquery',
        'underscore',
        'backbone',
        
        'collections/storage',
        'collections/testcases',
        'models/regexp',
        'models/testcase',
        'views/regexpview'
       ],
function($, _, Backbone, S, C, R, TC, RV) {
	var App = Backbone.View.extend({
		events: {},
		
		initialize: function() {
			console.log("[App:initialize]", arguments);
			var self = this;
			
			var data = {};
			if(localStorage.data) {
				data = JSON.parse(localStorage.data);
			}
			console.log("[App:initialize]", data);
			this.models = {
				regexp: new R(data)
			};
			this.collections = {
				testcases: new C({model:TC})
			};
			this.views = {
				regexp: new RV({el: '#regexp', model: this.models.regexp})
			};
			
			$(window).bind('beforeunload', function() {
				localStorage.data = JSON.stringify(self.models.regexp.toJSON());
			});
		},
		
		render: function() {
			console.log("[App:render]", arguments, this.models);
			for(view in this.views) {
				this.views[view].render();
			}
		},
		
		start: function() {
			console.log("[App:start]", arguments, this.models);
		}
	});
	
	return new App();
});