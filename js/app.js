/*
 * App Layer
 */

(function() {
	function matchText(node, regex, callback, excludeElements) { 

	    excludeElements || (excludeElements = ['script', 'style', 'iframe', 'cavas']);
	    
	    var child = node.first();
	   
	    do {

	        switch (child.nodeType()) {

	        case 1:
	            if (excludeElements.indexOf(child.tagName().toLowerCase()) > -1) {
	                continue;
	            }

	            matchText(child, regex, callback, excludeElements);
	            break;

	        case 3:
	           child.data().replace(regex, function(all) {
	                var args = [].slice.call(arguments),
	                    offset = args[args.length - 2],
	                    newTextNode = child.splitText(offset);

	                newTextNode.data(newTextNode.data().substr(all.length));

	                callback.apply(window, [child].concat(args));

	                child = newTextNode;
	     
	            });
	            break;

	        }

	    } while (child = child.next());

	    return node;

	}
	
	function ViewModel() {
		this._data = {
				regexp: "",
				testcase: "",
				testCases: [],
				results: []
		};
		if(localStorage.data) {
			var self = this;
			Utils.merge(
					this._data,
					JSON.parse(localStorage.data),
					{
						testCases: {
							children: {
								_all: {
									after: function(object) {
										console.log("[testCases:after]", object);
										object.select = function(data) {
											console.log("[ViewModel::saveTestCases(select)]", self, data);
											self._selected = data;
											$('.test.cases.command .remove').removeAttr("disabled");
										};
									}
								}
							}
						}
					}
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
			    	console.log("[init]", "html:", arguments);
			    	var value = valueAccessor();
			    	var valueUnwrapped = ko.unwrap(value);
			    	$(element).html(valueUnwrapped.toString());
			    },
			    update: function(element, valueAccessor, allBindings, bindingContext) {
			    	console.log("[update]", "html:", arguments);
			    	var value = valueAccessor();
			    	var valueUnwrapped = ko.unwrap(value);
			    	$(element).html(valueUnwrapped.toString());
			    }
			};
		ko.bindingHandlers.RegExp = {
			    init: function(element, valueAccessor, allBindings, bindingContext) {
			    	console.log("[init]", "RegExp:", arguments);
			    	var value = valueAccessor();
			    	var valueUnwrapped = ko.unwrap(value);
			    	$(element).html(valueUnwrapped.toString());
			    },
			    update: function(element, valueAccessor, allBindings, bindingContext) {
			    	console.log("[update]", "RegExp:", arguments);
			    	var value = valueAccessor();
			    	var valueUnwrapped = ko.unwrap(value);
			    	$(element).html(valueUnwrapped.toString());
			    }
			};
	}
	ViewModel.prototype = {
			runTestCases: function() {
				
				var self = this;
				var regexpText = ko.unwrap(this.regexp());
				var regexp = new RegExp(regexpText, "i");
				var list = ko.unwrap(this.testCases());
				console.log("[ViewModel::runTestCases]", this._data, this.regexp(), regexpText, list);
				_.each(list, function(testcase, key) {
					console.log("[ViewModel::list.each]", arguments, testcase, key);
					self.results.push({
						test: regexp.test(testcase.data),
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
				var self = this;
				if(this.testcase()!="") {
					this.testCases.push({
						data: ko.utils.unwrapObservable(this.testcase),
						select: function(data) {
							console.log("[ViewModel::saveTestCases(select)]", self, data);
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
		model._data.regexp = ko.utils.unwrapObservable(model.regexp);
		model._data.results = [];
		localStorage.data = JSON.stringify(model._data);
	    return '';
	});
	$(window).unload(function() {
		sessionStorage.data = JSON.stringify(model._data);
	});
}).call(this);