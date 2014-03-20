define(['jquery', 'underscore', 'utils'],
function($, _, U) {
	function htmlEscape(str) {
		if (U.type(str)=="string") {
			return str
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
		}
		try {
			return JSON.stringify(str)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
		} catch(e) {
			return String(str)
			.replace(/&/g, '&amp;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
		}
	}

	var Console = window.console;
	var $console = $('#console');
	window.console = {
			assert: function() {
				Console.assert.apply(window, arguments);
			},
			dir: function() {
				Console.dir.apply(window, arguments);
			},
			error: function() {
				Console.error.apply(window, arguments);
				var line = $('<div class="error"></div>');
				for(var i=0; i<arguments.length; ++i) {
					line.append(htmlEscape(arguments[i]));
				}
				$console.append(line);
			},
			exception: function() {
				Console.exception.apply(window, arguments);
			},
			group: function() {
				Console.group.apply(window, arguments);
			},
			groupCollapsed: function() {
				Console.groupCollapsed.apply(window, arguments);
			},
			groupEnd: function() {
				Console.groupEnd.apply(window, arguments);
			},
			info: function() {
				Console.info.apply(window, arguments);
				var line = $('<div class="info"></div>');
				for(var i=0; i<arguments.length; ++i) {
					line.append(htmlEscape(arguments[i]));
				}
				$console.append(line);
			},
			log: function() {
				Console.log.apply(Console, arguments);
				var line = $('<div class="log"></div>');
				line.append(_.map(arguments, function(item) {
					return '<span>'+htmlEscape(item)+'</span>';
				}).join(" "));
				$console.append(line);
			},
			profile: function() {
				Console.profile.apply(window, arguments);
			},
			profileEnd: function() {
				Console.profileEnd.apply(window, arguments);
			},
			time: function() {
				Console.time.apply(window, arguments);
			},
			timeEnd: function() {
				Console.timeEnd.apply(window, arguments);
			},
			trace: function() {
				Console.trace.apply(window, arguments);
			},
			warn: function() {
				Console.warn.apply(window, arguments);
			}
	};

	return window.console;
});