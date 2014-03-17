define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/regexp.template.html'
], function($, _, Backbone, template){
	return Backbone.View.extend({
		el: '#regexp',
		regexpTmpl: _.template(template),
		
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
});