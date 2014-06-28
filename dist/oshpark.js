(function() {
  window.Oshpark = {
    modelWithAttributes: function(attributes) {
      var Model;
      Model = (function() {
        function Model(json) {
          var attribute, _i, _len;
          for (_i = 0, _len = attributes.length; _i < _len; _i++) {
            attribute = attributes[_i];
            if (json[attribute] != null) {
              this[attribute] = json[attribute];
            }
          }
        }

        return Model;

      })();
      return Model;
    }
  };

}).call(this);

(function() {
  var Client, deleteRequest, getRequest, lastTimeoutId, postRequest, putRequest, reallyRequestToken, refreshToken, resource, resources;

  lastTimeoutId = null;

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

  reallyRequestToken = function(params) {
    return postRequest.call(this, 'sessions', params).then((function(_this) {
      return function(json) {
        var ttl;
        _this.token = new Oshpark.Token(json['api_session_token']);
        ttl = _this.token.ttl - 10;
        if (ttl < 10) {
          ttl = 10;
        }
        if (lastTimeoutId != null) {
          clearTimeout(lastTimeoutId);
        }
        lastTimeoutId = setTimeout((function() {
          return refreshToken.call(_this);
        }), ttl * 1000);
        return _this.token;
      };
    })(this));
  };

  refreshToken = function(params) {
    if (params == null) {
      params = {};
    }
    if (this.tokenPromise) {
      return this.tokenPromise.then((function(_this) {
        return function() {
          return reallyRequestToken.call(_this, params);
        };
      })(this));
    } else {
      return this.tokenPromise = reallyRequestToken.call(this, params);
    }
  };

  resources = function(resources_name, klass) {
    return getRequest.call(this, resources_name).then(function(data) {
      var json, _i, _len, _ref, _results;
      _ref = data[resources_name];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        json = _ref[_i];
        _results.push(new klass(json));
      }
      return _results;
    });
  };

  resource = function(resource_name, klass, id) {
    return new RSVP.Promise(function(resolve, reject) {
      if (id == null) {
        reject(new Error("must provide an id for " + resource_name));
      }
      return resolve();
    }).then((function(_this) {
      return function() {
        return getRequest.call(_this, "" + resource_name + "s/" + id).then(function(data) {
          return new klass(data[resource_name]);
        });
      };
    })(this));
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
      return this.token && (this.token.user != null);
    };

    Client.prototype.authenticate = function(email, opts) {
      if (opts == null) {
        opts = {};
      }
      return this.tokenPromise.then((function(_this) {
        return function() {
          var params;
          params = {
            email: email
          };
          if (opts.withPassword != null) {
            params.password = opts.withPassword;
          } else if (opts.withApiSecret != null) {
            params.api_key = (new jsSHA("" + email + ":" + opts.withApiSecret + ":" + _this.token.token, 'TEXT')).getHash('SHA-256', 'HEX');
          }
          return new RSVP.Promise(function(resolve, reject) {
            return refreshToken.call(_this, params).then(function(token) {
              if (token.user_id != null) {
                return resolve(token.user_id);
              } else {
                return reject("Incorrect username or password");
              }
            })["catch"](function(error) {
              return reject(error);
            });
          });
        };
      })(this));
    };

    Client.prototype.projects = function() {
      return resources.call(this, 'projects', Oshpark.Project);
    };

    Client.prototype.project = function(id) {
      return resource.call(this, 'project', Oshpark.Project, id);
    };

    Client.prototype.orders = function() {
      return resources.call(this, 'orders', Oshpark.Order);
    };

    Client.prototype.order = function(id) {
      return resource.call(this, 'order', Oshpark.Order, id);
    };

    Client.prototype.panels = function() {
      return resources.call(this, 'panels', Oshpark.Panel);
    };

    Client.prototype.panel = function(id) {
      return resource.call(this, 'panel', Oshpark.Panel, id);
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
        headers['Authorization'] = token.token;
      }
      return headers;
    };

    return Connection;

  })();

  Oshpark.Connection = Connection;

}).call(this);

(function() {
  var Image,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Image = (function(_super) {
    __extends(Image, _super);

    function Image() {
      return Image.__super__.constructor.apply(this, arguments);
    }

    return Image;

  })(Oshpark.modelWithAttributes(['thumb_url', 'large_url', 'original_url']));

  Oshpark.Image = Image;

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

(function() {
  var Order,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Order = (function(_super) {
    __extends(Order, _super);

    function Order() {
      return Order.__super__.constructor.apply(this, arguments);
    }

    return Order;

  })(Oshpark.modelWithAttributes(['id', 'board_cost', 'cancellation_reason', 'cancelled_at', 'ordered_at', 'payment_provider', 'payment_received_at', 'project_name', 'quantity', 'shipping_address', 'shipping_cost', 'shipping_country', 'shipping_method', 'shipping_name', 'state', 'total_cost', 'project_id', 'panel_id']));

  Oshpark.Order = Order;

}).call(this);

(function() {
  var Panel,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Panel = (function(_super) {
    __extends(Panel, _super);

    function Panel() {
      return Panel.__super__.constructor.apply(this, arguments);
    }

    return Panel;

  })(Oshpark.modelWithAttributes(['id', 'pcb_layers', 'scheduled_order_time', 'expected_receive_time', 'ordered_at', 'received_at', 'state', 'service', 'total_orders', 'total_boards', 'board_area_in_square_mils']));

  Oshpark.Panel = Panel;

}).call(this);

(function() {
  var Project,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Project = (function(_super) {
    __extends(Project, _super);

    function Project(json) {
      Project.__super__.constructor.call(this, json);
      if (this.top_image != null) {
        this.top_image = new Oshpark.Image(this.top_image);
      }
      if (this.bottom_image != null) {
        this.bottom_image = new Oshpark.Image(this.bottom_image);
      }
      if (this.width_in_mils != null) {
        this.width_in_inches = this.width_in_mils / 1000.0;
      }
      if (this.height_in_mils != null) {
        this.height_in_inches = this.height_in_mils / 1000.0;
      }
      if (this.width_in_inches != null) {
        this.width_in_mm = this.width_in_inches / 25.4;
      }
      if (this.height_in_inches != null) {
        this.height_in_mm = this.height_in_inches / 25.4;
      }
    }

    return Project;

  })(Oshpark.modelWithAttributes(['id', 'design_file_url', 'name', 'description', 'top_image', 'bottom_image', 'width_in_mils', 'pcb_layers', 'state', 'layers']));

  Oshpark.Project = Project;

}).call(this);

(function() {
  var Token,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Token = (function(_super) {
    __extends(Token, _super);

    function Token(json) {
      Token.__super__.constructor.call(this, json);
      if (this.user_id != null) {
        this.user = new Oshpark.User({
          id: this.user_id
        });
      }
    }

    return Token;

  })(Oshpark.modelWithAttributes(['token', 'ttl', 'user_id']));

  Oshpark.Token = Token;

}).call(this);

(function() {
  var User,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  User = (function(_super) {
    __extends(User, _super);

    function User() {
      return User.__super__.constructor.apply(this, arguments);
    }

    return User;

  })(Oshpark.modelWithAttributes(['id']));

  Oshpark.User = User;

}).call(this);
