/*
 * Application Layer
 */
define([
        'jquery',
        'underscore',
        'backbone',
        
        'models/regexp',
        'views/regexpview'
       ],
function($, _, Backbone, R, RV) {
	var App = Backbone.View.extend({
		events: {},
		
		initialize: function() {
			console.log("[App:initialize]", arguments);
			this.models = {
				regexp: new R()
			};
			this.views = {
				regexp: new RV({el: '#regexp', model: this.models.regexp})
			};
		},
		
		render: function() {
			console.log("[App:render]", arguments, this.models);
			for(view in this.views) {
				this.views[view].render();
			}
		},
		
		start: function() {
			console.log("[App:start]", arguments, this.models);
			for(view in this.models) {
				this.views[view].fetch();
			}
		}
	});
	
	return new App();
});