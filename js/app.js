/*
 * Application Layer
 */

(function() {
	_.templateSettings = {
			interpolate : /\{\{(.+?)\}\}/g,
			variable: "rc"
		};
	
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
			
			this.regexp = {
					m: new this.models.Regexp()
			};
			this.regexp.v = new this.views.Regexp({el:'#regexp', model: this.regexp.m});
			
			console.log("[ViewModel]", this);
		},
		initModels: function() {
			this.models.Result = Backbone.Model.extend({
				initialize: function() {
					console.log("[Model]", this);
				},
				
				defaults: {
					regexp: null,
					text: ""
				}
			});
			this.models.TestCase = Backbone.Model.extend({
				initialize: function() {
					console.log("[Model]", this);
				},
				
				defaults: {
					id: 0,
					data: ""
				}
			});
			this.models.Regexp = Backbone.Model.extend({
				initialize: function() {
					console.log("[Model]", this);
				},
				
				defaults: {
					text: ""
				}
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
				template: $.template('#resultsTemplate'),
				
				render: function() {
					this.template
					.tmpl(this.models.Result.toJSON())
					.appendTo(this.$el);
					
					return this;
				}
			});
			this.views.Regexp = Backbone.View.extend({
				el: '#regexp',
				regexpTmpl: _.template($('#regexpTemplate').html()),
				
				initialize: function() {
					console.log("[View]", this);
					this.model.bind('change', _.bind(this.render, this));
					this.render();
				},
				
				render: function() {
					var template = this.regexpTmpl(this.model.toJSON());
					console.log("[Regexp:render]", template);
					
					this.$el.html(template);
					
					return this;
				}
			});
			
			var TestCaseView = Backbone.View.extend({
				events: {},
				tagName: 'div',
				className: 'test case',
				template: $.template('#testCaseTemplate'),
				
				render: function() {
					this.template
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
					_.each(items, function() {
						
					});
					return this;
				}
			});
		}
	};
	
	$(function() {
		var view = new ViewModel();
		view.init();
	});
}).call(this);