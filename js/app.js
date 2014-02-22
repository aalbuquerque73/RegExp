/*
 * App Layer
 */

(function() {
	function ClassNameModel() {

	}
	ClassNameModel.prototype = {
			init: function(element, valueAccessor, allBindings, bindingContext) {
				//console.log("[init]", "className:", arguments);
				var value = valueAccessor();
				var valueUnwrapped = ko.unwrap(value);
				$(element).addClass(valueUnwrapped.toString());
			},
			update: function(element, valueAccessor, allBindings, bindingContext) {
				//console.log("[update]", "className:", arguments);
				var value = valueAccessor();
				var valueUnwrapped = ko.unwrap(value);
				$(element).addClass(valueUnwrapped.toString());
			}
	};
	function HtmlModel() {

	}
	HtmlModel.prototype = {
			init: function(element, valueAccessor, allBindings, bindingContext) {
				//console.log("[init]", "html:", arguments);
				var value = valueAccessor();
				var valueUnwrapped = ko.unwrap(value);
				$(element).html(valueUnwrapped.toString());
			},
			update: function(element, valueAccessor, allBindings, bindingContext) {
				//console.log("[update]", "html:", arguments);
				var value = valueAccessor();
				var valueUnwrapped = ko.unwrap(value);
				$(element).html(valueUnwrapped.toString());
			}
	};
	function RegExpModel() {
		this._data = {};
	}
	RegExpModel.prototype = {
			init: function(element, valueAccessor, allBindings, bindingContext) {
				console.log("[init]", "RegExp:", arguments);
				var value = valueAccessor();
				var valueUnwrapped = ko.unwrap(value);
				//console.log("[init]", "RegExp:", element);
				model.bindings.regexp._data[element] = {
						value: valueUnwrapped,
						element: $(element).html()
				};
			},
			update: function(element, valueAccessor, allBindings, bindingContext) {
				console.log("[update]", arguments);
				var value = valueAccessor();
				var valueUnwrapped = ko.unwrap(value);
				var text = $(element).html();
				var div = $(element);
				div.empty();
				var start = 0;
				//var text = model.bindings.regexp._data[element].element;
				console.log("[update]", "text:", text);
				text.replace(new RegExp(valueUnwrapped, "i"), function(match) {
					console.log("[update]", "RegExp:", arguments);
					var offset = arguments[arguments.length-2];
					div.append(text.substr(start, offset));
					var group = "";
					for(var i=1; i<arguments.length-2; ++i) {
						//if(arguments[i]) {
							group += "'" + arguments[i] + "',";
						//}
					}
					while(group.substr(group.length-1)==",") {
						group = group.substr(0, group.length-1);
					}
					if(group) {
						group = "[" + group.trim(",") + "]";
					}
					
					div.append('<span class="mark" title="'+group+'">'+match+'</span>');
					start = offset+match.length;
				});
				if(start<text.length) {
					div.append(text.substr(start));
				}
			}
	};
	function RelModel() {

	}
	RelModel.prototype = {
			init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
	            //console.log("[init]", "rel:", arguments);
				var value = valueAccessor();
				var valueUnwrapped = ko.unwrap(value);
				$(element).attr('rel', valueUnwrapped);
	        },
			update: function(element, valueAccessor, allBindings, bindingContext) {
				//console.log("[update]", "rel:", arguments);
			}
	};

	function ViewModel() {
		this._data = {
				regexp: "",
				testcase: "",
				global_id: 0,
				testCases: [],
				results: []
		};
		if(localStorage.data) {
			Utils.merge(
					this._data,
					JSON.parse(localStorage.data)
			);
		}
		this._selected = null;
		function observable(obj, data) {
			_.each(data, function(value, key) {
				if(Utils.type(value)=="array") {
					obj[key] = ko.observableArray(value);
					return;
				}
				if(Utils.type(value)=="obj") {
					obj[key] = {};
					observable(obj[key], value);
					return;
				}
				obj[key] = ko.observable(value);
			});
		}
		console.log("[ViewModel]", this._data);
		observable(this, this._data);
		
		this.bindings = {};
		this.bindings.className = ko.bindingHandlers.className = new ClassNameModel();
		this.bindings.html = ko.bindingHandlers.html = new HtmlModel();
		this.bindings.regexp = ko.bindingHandlers.RegExp = new RegExpModel();
		//this.bindings.click = ko.bindingHandlers.click = new ClickModel();
	}
	ViewModel.prototype = {
			runTestCases: function() {

				var self = this;
				var regexpText = ko.unwrap(this.regexp());
				var regexp = regexpText;
				var list = ko.unwrap(this.testCases());
				console.log("[ViewModel::runTestCases]", this._data, this.regexp(), regexpText, list);
				this.results.removeAll();
				_.each(list, function(testcase, key) {
					console.log("[ViewModel::list.each]", arguments, testcase, key);
					self.results.push({
						test: new RegExp(regexp, "i").test(testcase.data),
						regexp: regexp,
						value: testcase.data
					});
				});
			},
			addTestCase: function() {
				$('.test.edit.case').show(function() {
					$('.test.edit.case input.edit').focus();
				});
			},
			removeTestCase: function() {
				console.log("[ViewModel::removeTestCases]", this, this._selected);
				this.testCases.remove(this._selected);
				this._selected = null;
				$('.test.cases.command .remove').attr("disabled", "disabled");
			},
			saveTestCase: function() {
				if(this.testcase()!="") {
					this.testCases.push({
						data: ko.utils.unwrapObservable(this.testcase),
						id: this.nextId()
					});
				}
				$('.test.edit.case').hide(function() {
					$('.test.edit.case input.edit').val("");
				});
			},
			cancelTestCase: function() {
				$('.test.edit.case').hide(function() {

				});
			},
			
			select: function(data) {
				console.log("[ViewModel::select]", arguments);
				if(model._selected) {
					$('#editor'+model._selected.id).hide();
				}
				model._selected = data;
				//$('#span'+data.id).fadeTo(0, 0);
				//$('#span'+data.id).hide();
				$('#editor'+data.id).show();
				$('.test.cases.command .remove').removeAttr('disabled');
			},
			
			edit: function(data) {
				console.log("[ViewModel::edit]", arguments);
				$('#input'+data.id).show(function() {
					$(this).focus();
				});
			},
			
			remove: function(data) {
				console.log("[ViewModel::remove]", arguments);
				model.testCases.remove(data);
				model._selected = null;
				$('.test.cases.command .remove').attr("disabled", "disabled");
			},
			
			nextId: function() {
				var id = this._data.global_id + 1;
				++this._data.global_id;
				
				return id;
			}
	};

	var model = new ViewModel();
	$(function() {
		ko.applyBindings(model);
		console.log("window.load", sessionStorage, localStorage);
	});
	$(window).bind('beforeunload',function(){
		model._data.regexp = ko.utils.unwrapObservable(model.regexp);
		model._data.results = [];
		localStorage.data = JSON.stringify(model._data);
		return '';
	});
	$(window).unload(function() {
		sessionStorage.data = JSON.stringify(model._data);
	});
}).call(this);