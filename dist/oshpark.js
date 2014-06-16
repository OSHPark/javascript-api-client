(function() {
  window.Oshpark = {};

}).call(this);

(function() {
  var Client, deleteRequest, getRequest, postRequest, putRequest, refreshToken;

  postRequest = function(endpoint, params) {
    return this.connection.request('POST', endpoint, params, this.token);
  };

  putRequest = function(endpoint, params) {
    return this.connection.request('PUT', endpoint, params, this.token);
  };

  getRequest = function(endpoint, params) {
    return this.connection.request('GET', endpoint, params, this.token);
  };

  deleteRequest = function(endpoint, params) {
    return this.connection.request('DELETE', endpoint, params, this.token);
  };

  refreshToken = function(params) {
    if (params == null) {
      params = {};
    }
    return postRequest.call(this, 'sessions', params).then(function(json) {
      this.token = new Token(json);
      return setTimeout((function() {
        return refreshToken.call(this);
      }), this.token.token - 5);
    });
  };

  Client = (function() {
    function Client(_arg) {
      var connection, url, _ref;
      _ref = _arg != null ? _arg : {}, url = _ref.url, connection = _ref.connection;
      if (url == null) {
        url = "https://oshpark.com/api/v1";
      }
      if (connection == null) {
        connection = Oshpark.JQueryConnection;
      }
      this.connection = new connection(url);
      refreshToken.call(this);
    }

    Client.prototype.hasToken = function() {
      return !!this.token;
    };

    Client.prototype.isAuthenticated = function() {
      return this.token && !!this.token.user();
    };

    Client.prototype.authenticate = function(opts) {
      if (opts == null) {
        opts = {};
      }
      return new RSVP.Promise(function(resolve, reject) {
        return refreshToken.call(this, opts).then(function(token) {
          if (token.user() != null) {
            return resolve(token.user());
          } else {
            return reject("Incorrect username or password");
          }
        }).fail(function(error) {
          return reject(error);
        });
      });
    };

    return Client;

  })();

  Oshpark.Client = Client;

}).call(this);

(function() {
  var Connection;

  Connection = (function() {
    function Connection(endpointUrl) {
      this.endpointUrl = endpointUrl;
    }

    Connection.prototype.request = function(method, endpoint, params, token) {
      if (params == null) {
        params = {};
      }
      return new RSVP.Promise(function(resolve, reject) {
        return reject(new Error("Must choose connection subclass"));
      });
    };

    Connection.prototype.defaultHeaders = function(token) {
      var headers;
      if (token == null) {
        token = null;
      }
      headers = {
        'Accept': 'application/json'
      };
      if (token != null) {
        headers['Authorization'] = token.token();
      }
      return headers;
    };

    return Connection;

  })();

  Oshpark.Connection = Connection;

}).call(this);

(function() {
  var JQueryConnection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  JQueryConnection = (function(_super) {
    __extends(JQueryConnection, _super);

    function JQueryConnection() {
      return JQueryConnection.__super__.constructor.apply(this, arguments);
    }

    JQueryConnection.prototype.request = function(method, endpoint, params, token) {
      var headers, url;
      if (params == null) {
        params = {};
      }
      headers = this.defaultHeaders(token);
      url = "" + this.endpointUrl + "/" + endpoint;
      return new RSVP.Promise(function(resolve, reject) {
        return jQuery.ajax({
          dataType: 'json',
          data: params,
          headers: headers,
          url: url,
          type: method,
          success: function(data) {
            return resolve(data);
          },
          error: function(xhr, textStatus, errorThrown) {
            return reject(errorThrown);
          }
        });
      });
    };

    return JQueryConnection;

  })(Oshpark.Connection);

  Oshpark.JQueryConnection = JQueryConnection;

}).call(this);
