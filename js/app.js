/*
 * App Layer
 */

(function() {
	function ViewModel() {
		this._data = {
				regexp: "",
				testcase: "",
				testCases: [],
				results: []
		};
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
		observable(this, this._data);
		
		ko.bindingHandlers.className = {
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
		ko.bindingHandlers.html = {
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
	}
	ViewModel.prototype = {
			runTestCases: function() {
				function mark(data, test) {
					console.log("[runTestCases]", "mark:", arguments);
					if(test) {
						if(Utils.type(test)=="array") {
							var rpl = test[0];
							_.each(test, function(value, index, list) {
								if(index>0 && value) {
									rpl = rpl.replace(value, '<span class="mark group">'+value+'</span>');
								}
								console.log("[runTestCases]", "mark:replace", rpl);
							});
							console.log("[runTestCases]", "mark:", data.replace(test[0], '<span class="mark">'+rpl+'</span>'));
							return data.replace(test[0], '<span class="mark">'+rpl+'</span>');
						}
						return data.replace(test, '<span class="mark">'+test+'</span>');
					}
					return data;
				}
				var self = this;
				var regexp = new RegExp(ko.utils.unwrapObservable(ko.unwrap(this.regexp())), "i");
				var list = ko.unwrap(this.testCases());
				console.log(this._data, this.regexp(), ko.unwrap(this.regexp()), list);
				_.each(list, function(testcase, key) {
					console.log(arguments, testcase, key);
					self.results.push({
						test: regexp.test(testcase.data),
						value: mark(testcase.data, testcase.data.match(regexp), testcase.data.search(regexp))
					});
				});
			},
			addTestCase: function() {
				$('.test.edit.case').show(function() {
					$('.test.edit.case input.edit').focus();
				});
			},
			removeTestCase: function() {
				console.log(this, this._selected);
				this.testCases.remove(this._selected);
				this._selected = null;
				$('.test.cases.command .remove').attr("disabled", "disabled");
			},
			saveTestCase: function() {
				var self = this;
				if(this.testcase()!="") {
					this.testCases.push({
						data: ko.utils.unwrapObservable(this.testcase),
						select: function(data) {
							console.log(self, data);
							self._selected = data;
							$('.test.cases.command .remove').removeAttr("disabled");
						}
					});
				}
				$('.test.edit.case').hide(function() {
					$('.test.edit.case input.edit').val("");
				});
			},
			cancelTestCase: function() {
				$('.test.edit.case').hide(function() {
					
				});
			}
	};
	
	var model = new ViewModel();
	$(function() {
		ko.applyBindings(model);
		console.log("window.load", sessionStorage, localStorage);
	});
	$(window).bind('beforeunload',function(){
		localStorage.data = JSON.parse(model._data);
	    return '';
	});
	$(window).unload(function() {
		alert("Done here!");
		sessionStorage.data = JSON.parse(model._data);
	});
}).call(this);