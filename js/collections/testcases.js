define(['underscore','backbone', 'localstorage'],
function(_, Backbone, Store) {
	return Backbone.Collection.extend({
		localStorage: new Store("testcases"),
		
		initialize: function() {
			console.log("[TextCases:initialize]", this);
		}
	});
});