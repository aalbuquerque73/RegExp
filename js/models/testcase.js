define(['underscore','backbone'],
function(Backbone) {
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