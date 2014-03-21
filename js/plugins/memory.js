/**
 * Backbone memory Adapter
 * Version 1.1.0
 *
 */
(function (root, factory) {
	if (typeof define === "function" && define.amd) {
		// AMD. Register as an anonymous module.
		define(["underscore","backbone"], function(_, Backbone) {
			// Use global variables if the locals are undefined.
			return factory(_ || root._, Backbone || root.Backbone);
		});
	} else {
		// RequireJS isn't being used. Assume underscore and backbone are loaded in <script> tags
		factory(_, Backbone);
	}
}(this, function(_, Backbone) {
//	A simple module to replace `Backbone.sync` with *memory*-based
//	persistence. Models are given GUIDS, and saved into a JSON object. Simple
//	as that.

//	Hold reference to Underscore.js and Backbone.js in the closure in order
//	to make things work even if they are removed from the global namespace

//	Generate four random hex digits.
	function S4() {
		return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
	};

//	Generate a pseudo-GUID by concatenating random hexadecimal.
	function guid() {
		return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
	};

//	Our Store is represented by a single JS object in *memory*. Create it
//	with a meaningful name, like the name you'd give a table.
	Backbone.Memory = function(name) {
		console.log("[Backbone:Memory:constructor]", arguments);
		this.name = name;
		this.records = [];
		this._data = {};
	};

	_.extend(Backbone.Memory.prototype, {

		// Save the current state of the **Store** to *localStorage*.
		save: function() {
			console.log("[Backbone:Memory:save]", arguments);
		},

		// Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
		// have an id of it's own.
		create: function(model) {
			console.log("[Backbone:Memory:create]", arguments);
			if (!model.id) {
				model.id = guid();
				model.set(model.idAttribute, model.id);
			}
			var id = model.id.toString();
			this._data[id] = model;
			this.records.push(id);
			this.save();
			return this.find(model);
		},

		// Update a model by replacing its copy in `this.data`.
		update: function(model) {
			console.log("[Backbone:Memory:update]", arguments);
			var id = model.id.toString();
			this._data[id] = model;
			if (!_.include(this.records, id)) {
				this.records.push(id);
				this.save();
			}
			return this.find(model);
		},

		// Retrieve a model from `this.data` by id.
		find: function(model) {
			console.log("[Backbone:Memory:find]", arguments);
			return this._data[model.id.toString()];
		},

		// Return the array of all models currently in storage.
		findAll: function() {
			console.log("[Backbone:Memory:findAll]", arguments);
			return _(this.records).chain()
			.map(function(id){
				return this._data[id];
			}, this)
			.compact()
			.value();
		},

		// Delete a model from `this.data`, returning it.
		destroy: function(model) {
			console.log("[Backbone:Memory:destroy]", arguments);
			if (model.isNew()) {
				return false;
			}
			var modelId = model.id.toString();
			delete this._data[modelId];
			this.records = _.reject(this.records, function(id){
				return id === modelId;
			});
			this.save();
			return model;
		},

		// fix for "illegal access" error on Android when JSON.parse is passed null
		jsonData: function (data) {
			return data && JSON.parse(data);
		}

	});

//	localSync delegate to the model or collection's
//	*localStorage* property, which should be an instance of `Store`.
//	window.Store.sync and Backbone.localSync is deprectated, use Backbone.LocalStorage.sync instead
	Backbone.Memory.sync = Backbone.localSync = function(method, model, options) {
		console.log("[Backbone:Memory:sync]", arguments);
		var store = model.localStorage || model.collection.localStorage;

		var resp = null, errorMessage = null, syncDfd = $.Deferred && $.Deferred(); //If $ is having Deferred - use it.

		try {

			switch (method) {
			case "read":
				resp = model.id != undefined ? store.find(model) : store.findAll();
				break;
			case "create":
				resp = store.create(model);
				break;
			case "update":
				resp = store.update(model);
				break;
			case "delete":
				resp = store.destroy(model);
				break;
			}

		} catch(error) {
			errorMessage = error.message;
		}

		if (resp) {
			model.trigger("sync", model, resp, options);
			if (options && options.success)
				options.success(resp);
			if (syncDfd)
				syncDfd.resolve(resp);

		} else {
			errorMessage = errorMessage ? errorMessage
					: "Record Not Found";

			if (options && options.error)
				options.error(errorMessage);
			if (syncDfd)
				syncDfd.reject(errorMessage);
		}

		// add compatibility with $.ajax
		// always execute callback for success and error
		if (options && options.complete) options.complete(resp);

		return syncDfd && syncDfd.promise();
	};

	Backbone.ajaxSync = Backbone.sync;

	Backbone.getSyncMethod = function(model) {
		console.log("[Backbone:Memory:getSyncMethod]", arguments);
		if(model.localStorage || (model.collection && model.collection.localStorage)) {
			return Backbone.localSync;
		}

		return Backbone.ajaxSync;
	};

//	Override 'Backbone.sync' to default to localSync,
//	the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
	Backbone.sync = function(method, model, options) {
		return Backbone.getSyncMethod(model).apply(this, [method, model, options]);
	};

	return Backbone.Memory;
}));