define(['underscore','backbone'],
function(Backbone) {
	return Backbone.Model.extend({
		initialize: function() {
			console.log("[Result]", this);
		},
		
		defaults: {
			regexp: null,
			text: ""
		}
	});
});