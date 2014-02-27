/*
 * App Layer
 */

(function() {
	// function to cross-browser add a property to an object
	function addProperty(object, label, getter, setter) {
	    if (object.defineProperty){
	      object.defineProperty(object, label, {getter: getter, setter: setter});
	    }
	    else {
	        object.__defineGetter__(label, getter);
	        object.__defineSetter__(label, setter);
	    }
	}
	function Wrapper(model) {
        var _self = this;

        var setupProps = function(props) {
            props.forEach(function(prop) {
            	addProperty(
            		_self,
            		prop,
            		function() { return model.get(prop); },
            		function(val) { model.set(prop, val); }
            	);
            });
        };
        setupProps(_.keys(model.attributes));
    }
	
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
				render: function() {
					$('#resultsTemplate')
					.tmpl(new Wrapper(this.models.Result))
					.appendTo(this.$el);
					
					return this;
				}
			});
			this.views.Regexp = Backbone.View.extend({
				render: function() {
					$('#regexpTemplate')
					.tmpl(new Wrapper(this.models.Regexp))
					.appendTo(this.$el);
					
					return this;
				}
			});
			this.views.TestCases = Backbone.View.extend({
				render: function() {
					$('#testCaseTemplate')
					.tmpl(new Wrapper(this.models.TestCase))
					.appendTo(this.$el);
					
					return this;
				}
			});
		}
	};
	
	$(function() {
		
	});
}).call(this);