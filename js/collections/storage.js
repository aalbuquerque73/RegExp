define(['underscore','backbone', 'localstorage'],
function(_, Backbone, Store) {
	return Backbone.Collection.extend({
		localStorage: new Store("regexp"),
		
		initialize: function() {
			console.log("[Storage]", this);
		}
	});
});