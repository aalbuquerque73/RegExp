define([
        'jquery',
    	'underscore',
    	'backbone',
    	'collections/testcases',
    	'views/testcaseview'
    ],
function($, _, Backbone, TestCases, TestCaseView) {
	function Controller() {
		this.collection = new TestCases();
		
		this.listenTo(this.collection, 'add', this.add);
		this.listenTo(this.collection, 'reset', this.reset);
		this.listenTo(this.collection, 'all', this.render);
		
		this.collection.fetch();
		
		this.$views = {
			textcases: $('#textcases')
		};
	}
	Controller.prototype = {
		initialize: function() {
			console.log("[TestCaseController]", this);
		},
		
		add: function(model) {
			var view = new TestCaseView({model:model});
			this.$views.textcases.append(view);
		},
		reset: function() {
			
		},
		render: function() {
			
		}
	};
	
	_.extend(Controller.prototype, Backbone.Events);
	
	return Controller;
});