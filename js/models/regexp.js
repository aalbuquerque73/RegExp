define(['underscore','backbone', 'memory'],
function(_, Backbone, Store) {
	return Backbone.Model.extend({
		localStorage: new Store("regexp"),
		
		defaults: {
			text: ""
		},
		
		initialize: function() {
			console.log("[Regexp:initialize]", this);
		}
	});
});