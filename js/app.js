/*
 * App Layer
 */

(function() {
	function RegExpModel() {
		this._data = {};
	}
	RegExpModel.prototype = {
			init: function(element, valueAccessor, allBindings, bindingContext) {
				console.log("[init]", "RegExp:", arguments);
				var value = valueAccessor();
				var valueUnwrapped = ko.unwrap(value);

				var div = $(element);
				
				console.log("[init]", "data:", valueUnwrapped);
				
				var text = valueUnwrapped.value;
				var start = 0;
				//var text = model.bindings.regexp._data[element].element;
				console.log("[init]", "text:", text);
				text.replace(new RegExp(valueUnwrapped.regexp, "ig"), function(match) {
					var offset = arguments[arguments.length-2];
					console.log("[init]", "RegExp:", start, text.substr(start, offset-start), arguments);
					
					div.append(text.substr(start, offset-start));
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
				div.addClass(start>0?"true":"false");
			},
			update: function(element, valueAccessor, allBindings, bindingContext) {
				console.log("[update]", "RegExp:", arguments);
			}
	};
	
	function TestCaseModel(data, id) {
		this.data = ko.observable(data);
		this.id = id || Utils.guid();
	}

	function ViewModel() {
		this._data = {
				regexp: "",
				testcase: "",
				testCases: [],
				results: []
		};
		if(localStorage.data) {
			Utils.merge(
					this._data,
					JSON.parse(localStorage.data)
			);
		}
		console.log("[ViewModel]", this._data);
		
		this.regexp = ko.observable(this._data.regexp);
		this.testcase = ko.observable();
		this.testCases = ko.observableArray();
		this.results = ko.observableArray();
		_.each(this._data.testCases, function(test) {
			this.push(new TestCaseModel(test.data, test.id));
		}, this.testCases);
		
		ko.bindingHandlers.RegExp = new RegExpModel();
	}
	ViewModel.prototype = {
			unserialize: function() {
				if(localStorage.data) {
					Utils.merge(
							this._data,
							JSON.parse(localStorage.data)
					);
				}
				console.log("[ViewModel]", this._data);
				this.regexp = ko.observable(this._data.regexp);
				this.testCases = ko.observableArray();
				_.each(this._data.testCases, function(test) {
					this.push(new TestCaseModel(test.data, test.id));
				}, this.testCases);
			},
			serialize: function() {
				console.log("[serialize]", this._data);
				var data = {regexp:"", testCases:[]};
				data.regexp = ko.unwrap(this.regexp());
				var testcases = ko.unwrap(this.testCases);
				_.each(testcases, function(item){
					this.push({id:item.id, data:ko.unwrap(item.data())});
				}, data.testCases);
				console.log("[serialize]", data);
				localStorage.data = JSON.stringify(data);
			},
			
			runTestCases: function() {
				var regexp = ko.unwrap(this.regexp());
				var list = ko.unwrap(this.testCases());
				console.log("[ViewModel::runTestCases]", this._data, this.regexp(), regexp, list);
				this.results.removeAll();
				
				_.each(list, function(testcase, key) {
					console.log("[ViewModel::list.each]", arguments, testcase, key);
					this.push({
						regexp: regexp,
						value: ko.unwrap(testcase.data)
					});
				}, this.results);
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
					this.testCases.push(new TestCaseModel(ko.unwrap(this.testcase)));
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
					$('#editor'+model._selected.id).hide(100);
				}
				model._selected = data;
				//$('#span'+data.id).fadeTo(0, 0);
				//$('#span'+data.id).hide();
				$('#editor'+data.id).show(100);
				$('.test.cases.command .remove').removeAttr('disabled');
			},
			
			edit: function(data) {
				console.log("[ViewModel::edit]", arguments);
				$('#input'+data.id).show(function() {
					$(this).focus();
				});
				$('#edit_panel_'+data.id).hide(function(){});
				$('#confirm_panel_'+data.id).show(function(){});
				$('div.test.cases div.test.case .selector').hide();
			},
			
			remove: function(data) {
				console.log("[ViewModel::remove]", arguments);
				model.testCases.remove(data);
				model._selected = null;
				$('.test.cases.command .remove').attr("disabled", "disabled");
			},
			
			save: function(data) {
				$('#input'+data.id).hide(function() {});
				$('#edit_panel_'+data.id).show(function(){});
				$('#confirm_panel_'+data.id).hide(function(){});
				$('div.test.cases div.test.case .selector').show();
			},
			
			cancel: function(data) {
				$('#input'+data.id).hide(function() {});
				$('#edit_panel_'+data.id).show(function(){});
				$('#confirm_panel_'+data.id).hide(function(){});
				$('div.test.cases div.test.case .selector').show();
			},
			
			itemChanged: function(data) {
				console.log("[itemChanged]", arguments);
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
		model.serialize();
		return 'Serializing data';
	});
}).call(this);