define([
  'jquery',
  'underscore',
  'backbone',
  'template!#testCaseTemplate'
], function($, _, Backbone, tmpl){
	return Backbone.View.extend({
		el: '#testCases',
		tmpl: tmpl,
		
		events: {
			"focus .edit"     : "edit",
			"keypress .edit"  : "updateOnEnter",
			"blur .edit"      : "close"
		},
		
		initialize: function() {
			this.listenTo(this.model, 'change', this.render);
			this.listenTo(this.model, 'destroy', this.remove);
		},
		
		render: function() {
			var template = this.regexpTmpl(this.model.toJSON());
			console.log("[TestCases:render]", template, this.model.toJSON());
			
			this.$el.html(template);
			this.input = this.$('.edit');
			
			return this;
		},
		
		edit: function() {
			this.$el.addClass("editing");
		},
		close: function() {
			var value = this.input.val();
			if (!value) {
				this.clear();
			} else {
				this.model.save({text: value});
				this.$el.removeClass("editing");
			}
		},
		updateOnEnter: function(e) {
			if (e.keyCode == 13) this.close();
		},
		clear: function() {
			console.log("[View:Regexp:updateOnEnter]", this);
			this.model.destroy();
		}
	});
});