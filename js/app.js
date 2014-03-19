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
	_.templateSettings = {
			interpolate : /\{\{(.+?)\}\}/g,
			variable: "rc"
		};
	function App() {
		
	}
	App.prototype = Backbone.View.extend({
		events: {},
		
		initialize: function() {
			this.models = {
				regexp: new R()
			};
			this.views = {
				regexp: new RV({el: '#regexp', model: this.models.regexp})
			};
		},
		
		render: function() {
			
		}
	});
	
	return new App();
});