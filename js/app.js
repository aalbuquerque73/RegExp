/*
 * App Layer
 */

(function() {
	function ViewModel() {
		this.models = {};
		this.collections = {};
		this.views = {};
	}
	ViewModel.prototype = {
		init: function() {
			this.initModels();
			this.initCollections();
			this.initViews();
		},
		initModels: function() {
			this.models.Result = Backbone.Model.extend({
				defaults: {
					regexp: null,
					text: ""
				}
			});
			this.models.TestCase = Backbone.Model.extend({
				defaults: {
					id: 0,
					data: ""
				}
			});
			this.models.Regexp = Backbone.Model.extend({
				text: ""
			});
		},
		initCollections: function() {
			this.collections.Results = Backbone.Collection.extend({
				model: this.models.Result
			});
			this.collections.TestCases = Backbone.Collection.extend({
				model: this.models.TestCase
			});
		},
		initViews: function() {
			this.views.Results = Backbone.View.extend({
				collection: this.collections.Results,
				el:'#results',
				
				render: function() {
					$('#resultsTemplate')
					.tmpl(this.models.Result.toJSON())
					.appendTo(this.$el);
					
					return this;
				}
			});
			this.views.Regexp = Backbone.View.extend({
				model: this.models.Regexp,
				
				render: function() {
					$('#regexpTemplate')
					.tmpl(this.models.Regexp.toJSON())
					.appendTo(this.$el);
					
					return this;
				}
			});
			var TestCaseView = Backbone.View.extend({
				events: {},
				tagName: 'div',
				className: 'test case',
				
				render: function() {
					$('#testCaseTemplate')
					.tmpl(this.models.TestCase.toJSON())
					.appendTo(this.$el);
					
					return this;
				}
			});
			this.views.TestCases = Backbone.View.extend({
				collection: this.collections.TestCases,
				el: '#textcases',
				
				render: function() {
					var items = this.model.get('items');
					_.each(items, function() {});
					return this;
				}
			});
		}
	};
	
	$(function() {
		
	});
}).call(this);