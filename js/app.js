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
			
			// Models
			this.regexp = {
					m: new this.models.Regexp()
			};
			new this.views.Regexp({el:'#regexp', model: this.regexp.m});
			this.testcase = { m: null };
			
			// Collections
			this.collections = {
					testcases: new this.collections.TestCases(),
					results: new this.collections.Results()
			};

			this.events = _.extend({$super:this}, Backbone.Events);
			this.events.listenTo(this.collections.testcases, 'add', this.addOne);
			this.events.listenTo(this.collections.testcases, 'reset', this.addAll);
			this.events.listenTo(this.collections.testcases, 'all', this.render);
			
			console.log("[ViewModel]", this);
		},
		initModels: function() {
			this.models.Result = Backbone.Model.extend({
				initialize: function() {
					console.log("[Result]", this);
				},
				
				defaults: {
					regexp: null,
					text: ""
				}
			});
			this.models.TestCase = Backbone.Model.extend({
				initialize: function() {
					console.log("[TestCase]", this);
				},
				
				defaults: {
					id: 0,
					data: ""
				}
			});
			this.models.Regexp = Backbone.Model.extend({
				initialize: function() {
					console.log("[Regexp]", this);
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
				model: this.models.TestCase,
				
				localStorage: new Backbone.LocalStorage("testcases"),
			});
		},
		
		initViews: function() {
			var self = this;
			
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
					console.log("[View:Regexp]", this);
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
			
			this.views.TestCase = Backbone.View.extend({
				el: '#textcases',
				template: $.template('#testCaseTemplate'),
				
				initialize: function() {
					console.log("[View:TestCase]", this);
					this.$parent = self;
					this.model.bind('change', _.bind(this.render, this));
					this.render();
				},
				render: function() {
					console.log("[TestCase:render]", this.model.toJSON());
					var template = this.template(this.model.toJSON());
					console.log("[TestCase:render]", template);
					return this;
				}
			});

			this.views.EditTestCaseView = Backbone.View.extend({
				events: {
					'click button.save': 'save',
					'click button': 'close'
				},
				el: $('.test.edit.case'),

				regexpTmpl: _.template($('#editTestCaseTemplate').html()),
				
				initialize: function() {
					console.log("[View:TestCase]", this);
					this.$parent = self;
					this.model.bind('change', _.bind(this.render, this));
					
					this.render();
				},
				
				render: function() {
					var template = this.regexpTmpl(this.model.toJSON());
					console.log("[TestCase:render]", template);
					
					this.$el.html(template);
					this.$input = this.$('input.edit');
					
					return this;
				},
				
				newAttributes: function() {
					return {
						id: Utils.guid(),
						data: this.$input.val().trim()
					};
				},
				
				close: function() {
					console.log("[TestCase:close]", arguments);
					$('.test.edit.case').hide(function() {
						$('#add_testcase').removeAttr("disabled");
					});
				},
				save: function() {
					console.log("[TestCase:save]", arguments, this);
					if(!this.$input.val().trim()) {
						return;
					}

					this.$parent.collections.testcases.create( this.newAttributes() );
					this.$input.val('');
				}
			});
		},

		edit: function() {
			this.testcase.m = new this.models.TestCase();
			new this.views.EditTestCaseView({
				el:'.test.edit.case',
				model: this.testcase.m
			});

			$('.test.edit.case').show(function() {});
		},
		
		addOne: function(testcase) {
			console.log("[addOne]", arguments, this);
			var view = new this.$super.views.TestCase({model:testcase});
		},
		addAll: function() {
			console.log("[addAll]", arguments, this);
			this.collections.testcases.each(this.addOne, this);
		},
		
		render: function() {
			console.log("[render]", arguments, this);
		}
	};
	
	$(function() {
		var view = new ViewModel();
		view.init();
		
		$('#add_testcase').click(function() {
			$(this).attr("disabled", "disabled");
			view.edit();
		});
	});
}).call(this);