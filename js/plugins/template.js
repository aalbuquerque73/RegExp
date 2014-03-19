define(['jquery'],
function($) {
	return {
		load: function(name, req, onload, config) {
			_.templateSettings = {
				interpolate : /\{\{(.+?)\}\}/g,
				variable: "rc"
			};
			if(config.isBuild) {
				onload();
			} else {
				onload(_.template($(name).html()));
			}
		}
	};
});