define(['underscore','backbone', 'localstorage', 'models/testcase'],
function(_, Backbone, Store, TestCase) {
	return Backbone.Collection.extend({
		localStorage: new Store("testcases"),
		
		model: TestCase,
		
		comparator: 'id',
		
		initialize: function() {
			console.log("[TextCases:initialize]", this);
		}
	});
});