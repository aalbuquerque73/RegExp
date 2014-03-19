define(['underscore','backbone'],
function(_, Backbone) {
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