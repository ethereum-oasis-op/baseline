/* (C) 2020 - FreightTrust and Clearing Corporation
 * SPDX: MPL-2.0
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

(function($, undefined) {
  $.extend({
    jsonRPC: {
      // RPC Version Number
      version: '2.0',

      // End point URL, sets default in requests if not
      // specified with the request call
      endPoint: null,

      // Default namespace for methods
      namespace: null,

      /*
       * Provides the RPC client with an optional default endpoint and namespace
       *
       * @param {object} The params object which can contain
       *   endPoint {string} The default endpoint for RPC requests
       *   namespace {string} The default namespace for RPC requests
       *   cache {boolean} If set to false, it will force requested
       *       pages not to be cached by the browser. Setting cache
       *       to false also appends a query string parameter,
       *       "_=[TIMESTAMP]", to the URL. (Default: true)
       */
      setup: function(params) {
        this._validateConfigParams(params);
        this.endPoint = params.endPoint;
        this.namespace = params.namespace;
        this.cache = params.cache !== undefined ? params.cache : true;
        return this;
      },

      /*
       * Convenience wrapper method to allow you to temporarily set a config parameter
       * (endPoint or namespace) and ensure it gets set back to what it was before
       *
       * @param {object} The params object which can contains
       *   endPoint {string} The default endpoint for RPC requests
       *   namespace {string} The default namespace for RPC requests
       * @param {function} callback The function to call with the new params in place
       */
      withOptions: function(params, callback) {
        this._validateConfigParams(params);
        // No point in running if there isn't a callback received to run
        if(callback === undefined) throw("No callback specified");

        origParams = {endPoint: this.endPoint, namespace: this.namespace};
        this.setup(params);
        callback.call(this);
        this.setup(origParams);
      },

      /*
       * Performas a single RPC request
       *
       * @param {string} method The name of the rpc method to be called
       * @param {object} options A collection of object which can contains
       *  params {array} the params array to send along with the request
       *  success {function} a function that will be executed if the request succeeds
       *  error {function} a function that will be executed if the request fails
       *  url {string} the url to send the request to
       *  id {string} the provenance id for this request (defaults to 1)
       *  cache {boolean} If set to false, it will force requested
       *       pages not to be cached by the browser. Setting cache
       *       to false also appends a query string parameter,
       *       "_=[TIMESTAMP]", to the URL. (Default: cache value
       *       set with the setup method)
       * @return {undefined}
       */
      request: function(method, options) {
        if(options === undefined) {
          options = { id: 1 };
        }
        if (options.id === undefined) {
          options.id = 1;
        }
        if (options.cache === undefined) {
          options.cache = this.cache;
        }

        // Validate method arguments
        this._validateRequestMethod(method);
        this._validateRequestParams(options.params);
        this._validateRequestCallbacks(options.success, options.error);		
        // Perform the actual request
        this._doRequest(JSON.stringify(this._requestDataObj(method, options.params, options.id)), options);

        return true;
      },

      /*
       * Submits multiple requests
       * Takes an array of objects that contain a method and params
       *
       * @params {array} requests an array of request object which can contain
       *  method {string} the name of the method
       *  param {object} the params object to be sent with the request
       *  id {string} the provenance id for the request (defaults to an incrementer starting at 1)
       * @param {object} options A collection of object which can contains
       *  success {function} a function that will be executed if the request succeeds
       *  error {function} a function that will be executed if the request fails
       *  url {string} the url to send the request to
       * @return {undefined}
       */
      batchRequest: function(requests, options) {
        if(options === undefined) {
          options = {};
        }

        // Ensure our requests come in as an array
        if(!$.isArray(requests) || requests.length === 0) throw("Invalid requests supplied for jsonRPC batchRequest. Must be an array object that contain at least a method attribute");

        // Make sure each of our request objects are valid
        var _that = this;
        $.each(requests, function(i, req) {
          _that._validateRequestMethod(req.method);
          _that._validateRequestParams(req.params);
          if (req.id === undefined) {
            req.id = i + 1;
          }
        });
        this._validateRequestCallbacks(options.success, options.error);

        var data = [],
            request;

        // Prepare our request object
        for(var i = 0; i<requests.length; i++) {
          request = requests[i];
          data.push(this._requestDataObj(request.method, request.params, request.id));
        }

        this._doRequest(JSON.stringify(data), options);
      },

      // Validate a params hash
      _validateConfigParams: function(params) {
        if(params === undefined) {
          throw("No params specified");
        }
        else {
          if(params.endPoint && typeof(params.endPoint) !== 'string'){
            throw("endPoint must be a string");
          }
          if(params.namespace && typeof(params.namespace) !== 'string'){
            throw("namespace must be a string");
          }
        }
      },

      // Request method must be a string
      _validateRequestMethod: function(method) {
        if(typeof(method) !== 'string') throw("Invalid method supplied for jsonRPC request")
        return true;
      },

      // Validate request params.  Must be a) empty, b) an object (e.g. {}), or c) an array
      _validateRequestParams: function(params) {
        if(!(params === null ||
             params === undefined ||
             typeof(params) === 'object' ||
             $.isArray(params))) {
          throw("Invalid params supplied for jsonRPC request. It must be empty, an object or an array.");
        }
        return true;
      },

      _validateRequestCallbacks: function(success, error) {
        // Make sure callbacks are either empty or a function
        if(success !== undefined &&
           typeof(success) !== 'function') throw("Invalid success callback supplied for jsonRPC request");
        if(error !== undefined &&
         typeof(error) !== 'function') throw("Invalid error callback supplied for jsonRPC request");
        return true;
      },

      // Internal method used for generic ajax requests
      _doRequest: function(data, options) {
        var _that = this;
        $.ajax({
          type: 'POST',
          async: false !== options.async,
          dataType: 'json',
          contentType: 'application/json',
          url: this._requestUrl((options.endPoint || options.url), options.cache),
          data: data,
          cache: options.cache,
          headers: options.headers,
          processData: false,
          error: function(json) {
            _that._requestError.call(_that, json, options.error);
          },
          success: function(json) {			
            _that._requestSuccess.call(_that, json, options.success, options.error);
          }
        })
      },

      // Determines the appropriate request URL to call for a request
      _requestUrl: function(url, cache) {
        url = url || this.endPoint;
        if (!cache) {
            if (url.indexOf("?") < 0) {
              url += '?tm=' + new Date().getTime();
            }
            else {
              url += "&tm=" + new Date().getTime();
            }
        }
        return url;
      },

      // Creates an RPC suitable request object
      _requestDataObj: function(method, params, id) {
        var dataObj = {
          jsonrpc: this.version,
          method: this.namespace ? this.namespace +'.'+ method : method,
          id: id
        }
        if(params !== undefined) {
          dataObj.params = params;
        }
        return dataObj;
      },

      // Handles calling of error callback function
      _requestError: function(json, error) {
        if (error !== undefined && typeof(error) === 'function') {
          if(typeof(json.responseText) === 'string') {
            try {
              error(JSON.parse(json.responseText));
            }
            catch(e) {
              error(this._response());
            }
          }
          else {
            error(this._response());
          }
        }
      },

      // Handles calling of RPC success, calls error callback
      // if the response contains an error
      // TODO: Handle error checking for batch requests
      _requestSuccess: function(json, success, error) {
        var response = this._response(json);
		
        // If we've encountered an error in the response, trigger the error callback if it exists
        if(response.error && typeof(error) === 'function') {
          error(response);
          return;
        }

        // Otherwise, successful request, run the success request if it exists
        if(typeof(success) === 'function') {
          success(response);
        }
      },

      // Returns a generic RPC 2.0 compatible response object
      _response: function(json) {
        if (json === undefined) {
          return {
            error: 'Internal server error',
            version: '2.0'
          };
        }
        else {
          try {
            if(typeof(json) === 'string') {
              json = JSON.parse(json);
            }

            if (($.isArray(json) && json.length > 0 && json[0].jsonrpc !== '2.0') ||
                (!$.isArray(json) && json.jsonrpc !== '2.0')) {
              throw 'Version error';
            }

            return json;
          }
          catch (e) {
            return {
              error: 'Internal server error: ' + e,
              version: '2.0'
            }
          }
        }
      }

    }
  });
})(jQuery);