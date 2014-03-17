define(['underscore','backbone'],
function(Backbone) {
	return Backbone.Model.extend({
		initialize: function() {
			console.log("[Regexp]", this);
		},
		
		defaults: {
			text: ""
		}
	});
});