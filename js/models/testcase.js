define(['underscore','backbone'],
function(_, Backbone) {
	return Backbone.Model.extend({
		initialize: function() {
			console.log("[TestCase]", this);
		},

		defaults: {
			id: 0,
			data: ""
		}
	});
});