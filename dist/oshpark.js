(function() {
    "use strict";
    var oshpark$model_with_attributes$$camelize, oshpark$model_with_attributes$$modelWithAttributes;

    oshpark$model_with_attributes$$camelize = function(str) {
      return str.replace(/_([a-z])/g, function(g) {
        return g[1].toUpperCase();
      });
    };

    oshpark$model_with_attributes$$modelWithAttributes = function(attributes) {
      var Model;
      Model = (function() {
        function Model(json, client) {
          var attribute, camelized, _i, _len;
          if (client == null) {
            client = void 0;
          }
          this.client = client;
          this.__attrs__ = json;
          for (_i = 0, _len = attributes.length; _i < _len; _i++) {
            attribute = attributes[_i];
            camelized = oshpark$model_with_attributes$$camelize(attribute);
            if (this[camelized] == null) {
              this[camelized] = json[attribute];
            }
          }
        }

        return Model;

      })();
      return Model;
    };

    var oshpark$model_with_attributes$$default = oshpark$model_with_attributes$$modelWithAttributes;
    var oshpark$address$$Address,
      oshpark$address$$__hasProp = {}.hasOwnProperty,
      oshpark$address$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$address$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$address$$Address = (function(_super) {
      oshpark$address$$__extends(Address, _super);

      function Address() {
        return Address.__super__.constructor.apply(this, arguments);
      }

      return Address;

    })(oshpark$model_with_attributes$$default(['name', 'company_name', 'address_line_1', 'address_line_2', 'city', 'state', 'zip_or_postal_code', 'country', 'phone_number', 'is_business']));

    var oshpark$address$$default = oshpark$address$$Address;
    var oshpark$connection$$Connection;

    oshpark$connection$$Connection = (function() {
      function Connection(endpointUrl) {
        this.endpointUrl = endpointUrl;
      }

      Connection.prototype.request = function(method, endpoint, params, token) {
        if (params == null) {
          params = {};
        }
        return this._subclassesMustImplement('request');
      };

      Connection.prototype.createUpload = function() {
        return this._subclassesMustImplement('createUpload');
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

      Connection.prototype._subclassesMustImplement = function(methodName) {
        return new RSVP.Promise(function(resolve, reject) {
          return reject(new Error("Connection subclasses must implement the `" + methodName + "` method."));
        });
      };

      return Connection;

    })();

    var oshpark$connection$$default = oshpark$connection$$Connection;
    var oshpark$jquery_connection$$JQueryConnection,
      oshpark$jquery_connection$$__hasProp = {}.hasOwnProperty,
      oshpark$jquery_connection$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$jquery_connection$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$jquery_connection$$JQueryConnection = (function(_super) {
      oshpark$jquery_connection$$__extends(JQueryConnection, _super);

      function JQueryConnection() {
        JQueryConnection.__super__.constructor.apply(this, arguments);
        jQuery.ajaxSetup({
          dataFilter: function(data, type) {
            if (type === 'json' && data === '') {
              return null;
            }
            return data;
          }
        });
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

    })(oshpark$connection$$default);

    var oshpark$jquery_connection$$default = oshpark$jquery_connection$$JQueryConnection;
    var oshpark$user$$User,
      oshpark$user$$__hasProp = {}.hasOwnProperty,
      oshpark$user$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$user$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$user$$User = (function(_super) {
      oshpark$user$$__extends(User, _super);

      function User() {
        return User.__super__.constructor.apply(this, arguments);
      }

      return User;

    })(oshpark$model_with_attributes$$default(['id']));

    var oshpark$user$$default = oshpark$user$$User;
    var oshpark$token$$Token,
      oshpark$token$$__hasProp = {}.hasOwnProperty,
      oshpark$token$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$token$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$token$$Token = (function(_super) {
      oshpark$token$$__extends(Token, _super);

      function Token(json) {
        Token.__super__.constructor.call(this, json);
        if (this.userId != null) {
          this.user = new oshpark$user$$default({
            id: this.userId
          });
        }
      }

      return Token;

    })(oshpark$model_with_attributes$$default(['token', 'ttl', 'user_id']));

    var oshpark$token$$default = oshpark$token$$Token;
    var oshpark$image$$Image,
      oshpark$image$$__hasProp = {}.hasOwnProperty,
      oshpark$image$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$image$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$image$$Image = (function(_super) {
      oshpark$image$$__extends(Image, _super);

      function Image() {
        return Image.__super__.constructor.apply(this, arguments);
      }

      return Image;

    })(oshpark$model_with_attributes$$default(['thumb_url', 'large_url', 'original_url']));

    var oshpark$image$$default = oshpark$image$$Image;
    var oshpark$layer$$Layer,
      oshpark$layer$$__hasProp = {}.hasOwnProperty,
      oshpark$layer$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$layer$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$layer$$Layer = (function(_super) {
      oshpark$layer$$__extends(Layer, _super);

      function Layer() {
        return Layer.__super__.constructor.apply(this, arguments);
      }

      return Layer;

    })(oshpark$model_with_attributes$$default(['id', 'name', 'gerber_file_url', 'image', 'imported_from', 'width_in_mils', 'height_in_mils']));

    var oshpark$layer$$default = oshpark$layer$$Layer;
    var oshpark$project$$Project,
      oshpark$project$$__hasProp = {}.hasOwnProperty,
      oshpark$project$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$project$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$project$$Project = (function(_super) {
      oshpark$project$$__extends(Project, _super);

      function Project() {
        return Project.__super__.constructor.apply(this, arguments);
      }

      Project.prototype.topImage = function() {
        if (this.__attrs__.top_image != null) {
          return new oshpark$image$$default(this.__attrs__.top_image, this.client);
        }
      };

      Project.prototype.bottomImage = function() {
        if (this.__attrs__.bottom_image != null) {
          return new oshpark$image$$default(this.__attrs__.bottom_image, this.client);
        }
      };

      Project.prototype.layers = function() {
        var layer, layers, _i, _len, _ref;
        layers = [];
        _ref = this.__attrs__.layers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          layer = _ref[_i];
          layers.push(new oshpark$layer$$default(layer, this.client));
        }
        return layers;
      };

      Project.prototype.isNew = function() {
        return this.state === 'NEW';
      };

      Project.prototype.isApproved = function() {
        return this.state === 'APPROVED';
      };

      Project.prototype.isAwaitingRemoval = function() {
        return this.state === 'AWAITING_REMOVAL';
      };

      return Project;

    })(oshpark$model_with_attributes$$default(['id', 'design_file_url', 'name', 'description', 'top_image', 'bottom_image', 'width_in_mils', 'pcb_layers', 'state', 'layers']));

    var oshpark$project$$default = oshpark$project$$Project;
    var oshpark$shipping_rate$$ShippingRate,
      oshpark$shipping_rate$$__hasProp = {}.hasOwnProperty,
      oshpark$shipping_rate$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$shipping_rate$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$shipping_rate$$ShippingRate = (function(_super) {
      oshpark$shipping_rate$$__extends(ShippingRate, _super);

      function ShippingRate() {
        return ShippingRate.__super__.constructor.apply(this, arguments);
      }

      return ShippingRate;

    })(oshpark$model_with_attributes$$default(['carrier_name', 'service_name', 'price']));

    var oshpark$shipping_rate$$default = oshpark$shipping_rate$$ShippingRate;
    var oshpark$order_item$$OrderItem,
      oshpark$order_item$$__hasProp = {}.hasOwnProperty,
      oshpark$order_item$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$order_item$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$order_item$$OrderItem = (function(_super) {
      oshpark$order_item$$__extends(OrderItem, _super);

      function OrderItem() {
        return OrderItem.__super__.constructor.apply(this, arguments);
      }

      return OrderItem;

    })(oshpark$model_with_attributes$$default(['name', 'batches', 'batch_cost', 'sub_total', 'price', 'quantity', 'state', 'confirmed_at', 'panelized_at', 'ordered_at', 'fabbed_at', 'shipped_at', 'project_id', 'order_item_option_selections']));

    var oshpark$order_item$$default = oshpark$order_item$$OrderItem;
    var oshpark$order$$Order,
      oshpark$order$$__hasProp = {}.hasOwnProperty,
      oshpark$order$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$order$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$order$$Order = (function(_super) {
      oshpark$order$$__extends(Order, _super);

      function Order() {
        return Order.__super__.constructor.apply(this, arguments);
      }

      Order.prototype.address = function() {
        return new oshpark$address$$default(this.__attrs__.address);
      };

      Order.prototype.shippingRate = function() {
        return new oshpark$shipping_rate$$default(this.__attrs__.shipping_rate);
      };

      Order.prototype.orderItems = function() {
        var orderItem, _i, _len, _ref, _results;
        _ref = this.__attrs__.order_items;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          orderItem = _ref[_i];
          _results.push(new oshpark$order_item$$default(orderItem, this));
        }
        return _results;
      };

      Order.prototype.isEmpty = function() {
        return this.state === 'EMPTY';
      };

      Order.prototype.isNew = function() {
        return this.state === 'NEW';
      };

      Order.prototype.isReceived = function() {
        return this.state === 'RECEIVED';
      };

      Order.prototype.isProcessing = function() {
        return this.state === 'PROCESSING';
      };

      Order.prototype.isShipped = function() {
        return this.state === 'SHIPPED';
      };

      Order.prototype.isCancelled = function() {
        return this.state === 'CANCELLED';
      };

      Order.prototype.isCancellable = function() {
        return this.isEmpty() || this.isNew() || this.isReceived();
      };

      return Order;

    })(oshpark$model_with_attributes$$default(['id', 'board_cost', 'cancellation_reason', 'cancelled_at', 'ordered_at', 'payment_provider', 'payment_received_at', 'project_name', 'quantity', 'shipping_address', 'shipping_cost', 'shipping_country', 'shipping_method', 'shipping_name', 'state', 'total_cost', 'project_id', 'panel_id']));

    var oshpark$order$$default = oshpark$order$$Order;
    var oshpark$panel$$Panel,
      oshpark$panel$$__hasProp = {}.hasOwnProperty,
      oshpark$panel$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$panel$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$panel$$Panel = (function(_super) {
      oshpark$panel$$__extends(Panel, _super);

      function Panel() {
        return Panel.__super__.constructor.apply(this, arguments);
      }

      return Panel;

    })(oshpark$model_with_attributes$$default(['id', 'pcb_layers', 'scheduled_order_time', 'expected_receive_time', 'ordered_at', 'received_at', 'state', 'service', 'total_orders', 'total_boards', 'board_area_in_square_mils']));

    var oshpark$panel$$default = oshpark$panel$$Panel;
    var oshpark$upload$$Upload,
      oshpark$upload$$__hasProp = {}.hasOwnProperty,
      oshpark$upload$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$upload$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$upload$$Upload = (function(_super) {
      oshpark$upload$$__extends(Upload, _super);

      function Upload() {
        return Upload.__super__.constructor.apply(this, arguments);
      }

      Upload.prototype.isWaiting = function() {
        return this.state === 'WAITING';
      };

      Upload.prototype.isRunning = function() {
        return this.state === 'RUNNING';
      };

      Upload.prototype.isSuccessful = function() {
        return this.state === 'SUCCESS';
      };

      Upload.prototype.hasErrored = function() {
        return this.state === 'ERROR';
      };

      Upload.prototype.hasFailed = function() {
        return this.state === 'FAILED';
      };

      Upload.prototype.isProcessing = function() {
        return this.isWaiting() || this.isRunning();
      };

      Upload.prototype.isFinished = function() {
        return this.isSuccessful() || this.hasErrored() || this.hasFailed();
      };

      return Upload;

    })(oshpark$model_with_attributes$$default(['id', 'state', 'original_filename', 'error_message', 'queued_at', 'started_at', 'completed_at', 'errored_at', 'failed_at', 'project_id']));

    var oshpark$upload$$default = oshpark$upload$$Upload;
    var oshpark$import$$Import,
      oshpark$import$$__hasProp = {}.hasOwnProperty,
      oshpark$import$$__extends = function(child, parent) { for (var key in parent) { if (oshpark$import$$__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    oshpark$import$$Import = (function(_super) {
      oshpark$import$$__extends(Import, _super);

      function Import() {
        return Import.__super__.constructor.apply(this, arguments);
      }

      Import.prototype.isWaiting = function() {
        return this.state === 'WAITING';
      };

      Import.prototype.isRunning = function() {
        return this.state === 'RUNNING';
      };

      Import.prototype.isSuccessful = function() {
        return this.state === 'SUCCESS';
      };

      Import.prototype.hasErrored = function() {
        return this.state === 'ERROR';
      };

      Import.prototype.hasFailed = function() {
        return this.state === 'FAILED';
      };

      Import.prototype.isProcessing = function() {
        return this.isWaiting() || this.isRunning();
      };

      Import.prototype.isFinished = function() {
        return this.isSuccessful() || this.hasErrored() || this.hasFailed();
      };

      return Import;

    })(oshpark$model_with_attributes$$default(['id', 'state', 'original_url', 'original_filename', 'error_message', 'queued_at', 'started_at', 'completed_at', 'errored_at', 'failed_at', 'project_id']));

    var oshpark$import$$default = oshpark$import$$Import;
    var oshpark$client$$Client, oshpark$client$$argumentPromise, oshpark$client$$attributes_of, oshpark$client$$computeApiKey, oshpark$client$$createResource, oshpark$client$$deleteRequest, oshpark$client$$getRequest, oshpark$client$$lastTimeoutId, oshpark$client$$postRequest, oshpark$client$$putRequest, oshpark$client$$reallyRequestToken, oshpark$client$$refreshToken, oshpark$client$$resource, oshpark$client$$resources;

    oshpark$client$$lastTimeoutId = null;

    oshpark$client$$attributes_of = function(object) {
      if (object.__attrs__ != null) {
        return object.__attrs__;
      } else {
        return object;
      }
    };

    oshpark$client$$postRequest = function(endpoint, params) {
      return this.connection.request('POST', endpoint, params, this.token);
    };

    oshpark$client$$putRequest = function(endpoint, params) {
      return this.connection.request('PUT', endpoint, params, this.token);
    };

    oshpark$client$$getRequest = function(endpoint, params) {
      return this.connection.request('GET', endpoint, params, this.token);
    };

    oshpark$client$$deleteRequest = function(endpoint, params) {
      return this.connection.request('DELETE', endpoint, params, this.token);
    };

    oshpark$client$$reallyRequestToken = function(params) {
      return oshpark$client$$postRequest.call(this, 'sessions', params).then((function(_this) {
        return function(json) {
          var ttl;
          _this.token = new oshpark$token$$default(json['api_session_token'], _this);
          ttl = _this.token.ttl - 10;
          if (ttl < 10) {
            ttl = 10;
          }
          if (oshpark$client$$lastTimeoutId != null) {
            clearTimeout(oshpark$client$$lastTimeoutId);
          }
          oshpark$client$$lastTimeoutId = setTimeout((function() {
            return oshpark$client$$refreshToken.call(_this);
          }), ttl * 1000);
          return _this.token;
        };
      })(this));
    };

    oshpark$client$$refreshToken = function(params) {
      if (params == null) {
        params = {};
      }
      if (this.tokenPromise) {
        return this.tokenPromise.then((function(_this) {
          return function() {
            return oshpark$client$$reallyRequestToken.call(_this, params);
          };
        })(this));
      } else {
        return this.tokenPromise = oshpark$client$$reallyRequestToken.call(this, params);
      }
    };

    oshpark$client$$resources = function(resourcesName, klass, jsonRoot) {
      if (jsonRoot == null) {
        jsonRoot = resourcesName;
      }
      return oshpark$client$$getRequest.call(this, resourcesName).then((function(_this) {
        return function(data) {
          var json, _i, _len, _ref, _results;
          _ref = data[jsonRoot];
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            json = _ref[_i];
            _results.push(new klass(json, _this));
          }
          return _results;
        };
      })(this));
    };

    oshpark$client$$createResource = function(resourcesName, klass, params, jsonRoot) {
      if (params == null) {
        params = {};
      }
      if (jsonRoot == null) {
        jsonRoot = resourcesName;
      }
      return oshpark$client$$postRequest.call(this, resourcesName, params).then((function(_this) {
        return function(data) {
          return new klass(data[jsonRoot], _this);
        };
      })(this));
    };

    oshpark$client$$argumentPromise = function(id, resourceName, argName) {
      if (argName == null) {
        argName = 'id';
      }
      return new RSVP.Promise(function(resolve, reject) {
        if (id == null) {
          reject(new Error("must provide an " + argName + " for " + resourceName));
        }
        return resolve(id);
      });
    };

    oshpark$client$$resource = function(resourceName, klass, id, jsonRoot) {
      if (jsonRoot == null) {
        jsonRoot = resourceName;
      }
      return oshpark$client$$argumentPromise(id, resourceName).then((function(_this) {
        return function() {
          return oshpark$client$$getRequest.call(_this, "" + resourceName + "s/" + id);
        };
      })(this)).then((function(_this) {
        return function(data) {
          return new klass(data[jsonRoot], _this);
        };
      })(this));
    };

    oshpark$client$$computeApiKey = function(email, secret) {
      var hash, source;
      source = "" + email + ":" + secret + ":" + this.token.token;
      hash = new jsSHA(source, 'TEXT');
      return hash.getHash('SHA-256', 'HEX');
    };

    oshpark$client$$Client = (function() {
      function Client(_arg) {
        var connection, url, _ref;
        _ref = _arg != null ? _arg : {}, url = _ref.url, connection = _ref.connection;
        if (url == null) {
          url = "https://oshpark.com/api/v1";
        }
        if (connection == null) {
          connection = oshpark$jquery_connection$$default;
        }
        this.connection = new connection(url);
        oshpark$client$$refreshToken.call(this);
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
              params.api_key = oshpark$client$$computeApiKey.call(_this, email, opts.withApiSecret);
            } else {
              return reject("Must provide a password or api secret");
            }
            return new RSVP.Promise(function(resolve, reject) {
              return oshpark$client$$refreshToken.call(_this, params).then(function(token) {
                if (token.userId != null) {
                  return resolve(token.userId);
                } else {
                  return reject("Incorrect email address or password");
                }
              })["catch"](function(error) {
                return reject(error);
              });
            });
          };
        })(this));
      };

      Client.prototype.projects = function() {
        return oshpark$client$$resources.call(this, 'projects', oshpark$project$$default);
      };

      Client.prototype.project = function(id) {
        return oshpark$client$$resource.call(this, 'project', oshpark$project$$default, id);
      };

      Client.prototype.approveProject = function(id) {
        return oshpark$client$$argumentPromise(id, 'approveProject').then((function(_this) {
          return function() {
            return oshpark$client$$getRequest.call(_this, "projects/" + id + "/approve");
          };
        })(this)).then((function(_this) {
          return function(data) {
            return new oshpark$project$$default(data['project'], _this);
          };
        })(this));
      };

      Client.prototype.deleteProject = function(id) {
        return oshpark$client$$argumentPromise(id, 'deleteProject').then((function(_this) {
          return function() {
            return oshpark$client$$deleteRequest.call(_this, "projects/" + id);
          };
        })(this)).then(function() {
          return true;
        });
      };

      Client.prototype.updateProject = function(id, attrs) {
        if (attrs == null) {
          attrs = {};
        }
        return oshpark$client$$argumentPromise(id, 'updateProject').then((function(_this) {
          return function() {
            return oshpark$client$$putRequest.call(_this, "projects/" + id, {
              project: attrs
            });
          };
        })(this)).then((function(_this) {
          return function(data) {
            return new oshpark$project$$default(data['project'], _this);
          };
        })(this));
      };

      Client.prototype.sharedProjects = function() {
        return oshpark$client$$resources.call(this, 'shared_projects', oshpark$project$$default, 'projects');
      };

      Client.prototype.sharedProject = function(id) {
        return oshpark$client$$resource.call(this, 'shared_project', oshpark$project$$default, id, 'project');
      };

      Client.prototype.priceEstimate = function(width, height, layers, quantity) {
        if (layers == null) {
          layers = 2;
        }
        if (quantity == null) {
          quantity = 3;
        }
        return new RSVP.Promise((function(_this) {
          return function(resolve, reject) {
            if (height == null) {
              return reject("Must provide a board height");
            }
            if (width == null) {
              return reject("Must provide a board width");
            }
            return oshpark$client$$postRequest.call(_this, 'pricing', {
              width_in_mils: width,
              height_in_mils: height,
              pcb_layers: layers,
              quantity: quantity
            }).then(resolve, reject);
          };
        })(this));
      };

      Client.prototype.createOrder = function() {
        return oshpark$client$$createResource.call(this, 'orders', oshpark$order$$default, {}, 'order');
      };

      Client.prototype.orders = function() {
        return oshpark$client$$resources.call(this, 'orders', oshpark$order$$default);
      };

      Client.prototype.order = function(id) {
        return oshpark$client$$resource.call(this, 'order', oshpark$order$$default, id);
      };

      Client.prototype.cancelOrder = function(id) {
        return oshpark$client$$argumentPromise(id, 'cancelOrder').then((function(_this) {
          return function() {
            return oshpark$client$$deleteRequest.call(_this, "orders/" + id);
          };
        })(this)).then(function() {
          return true;
        });
      };

      Client.prototype.updateOrder = function(id, attrs) {
        if (attrs == null) {
          attrs = {};
        }
        return oshpark$client$$argumentPromise(id, 'updateOrder').then((function(_this) {
          return function() {
            return oshpark$client$$putRequest.call(_this, "orders/" + id, {
              order: attrs
            });
          };
        })(this)).then((function(_this) {
          return function(data) {
            return new oshpark$order$$default(data['order'], _this);
          };
        })(this));
      };

      Client.prototype.addItemToOrder = function(id, projectId, quantity) {
        if (quantity == null) {
          quantity = 3;
        }
        return oshpark$client$$argumentPromise(id, 'addItemToOrder').then((function(_this) {
          return function() {
            return oshpark$client$$argumentPromise(projectId, 'addItemToOrder', 'projectId');
          };
        })(this)).then((function(_this) {
          return function() {
            return oshpark$client$$postRequest.call(_this, "orders/" + id + "/add_item", {
              order: {
                project_id: projectId,
                quantity: quantity
              }
            });
          };
        })(this)).then((function(_this) {
          return function(data) {
            return new oshpark$order$$default(data['order'], _this);
          };
        })(this));
      };

      Client.prototype.setOrderAddress = function(id, address) {
        return oshpark$client$$argumentPromise(id, 'setOrderAddress').then((function(_this) {
          return function() {
            return oshpark$client$$argumentPromise(address, 'setOrderAddress', 'address').then(function() {
              return oshpark$client$$postRequest.call(_this, "orders/" + id + "/set_address", {
                order: {
                  address: oshpark$client$$attributes_of(address)
                }
              }).then(function(data) {
                return new oshpark$order$$default(data['order'], _this);
              });
            });
          };
        })(this));
      };

      Client.prototype.setOrderShippingRate = function(id, rate) {
        return oshpark$client$$argumentPromise(id, 'setOrderShippingRate').then((function(_this) {
          return function() {
            return oshpark$client$$argumentPromise(rate, 'setOrderShippingRate', 'rate').then(function() {
              return oshpark$client$$postRequest.call(_this, "orders/" + id + "/set_shipping_rate", {
                order: {
                  shipping_rate: oshpark$client$$attributes_of(rate)
                }
              }).then(function(data) {
                return new oshpark$order$$default(data['order'], _this);
              });
            });
          };
        })(this));
      };

      Client.prototype.checkoutOrder = function(id) {
        return oshpark$client$$argumentPromise(id, 'checkoutOrder').then((function(_this) {
          return function() {
            return oshpark$client$$postRequest.call(_this, "orders/" + id + "/checkout").then(function(data) {
              return new oshpark$order$$default(data['order'], _this);
            });
          };
        })(this));
      };

      Client.prototype.shippingRates = function(address) {
        return oshpark$client$$argumentPromise(address, 'shippingRates', 'address').then((function(_this) {
          return function() {
            return oshpark$client$$postRequest.call(_this, "shipping_rates", {
              address: oshpark$client$$attributes_of(address)
            }).then(function(data) {
              var json, _i, _len, _ref, _results;
              _ref = data['shipping_rates'];
              _results = [];
              for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                json = _ref[_i];
                _results.push(new oshpark$shipping_rate$$default(json, _this));
              }
              return _results;
            });
          };
        })(this));
      };

      Client.prototype.panels = function() {
        return oshpark$client$$resources.call(this, 'panels', oshpark$panel$$default);
      };

      Client.prototype.panel = function(id) {
        return oshpark$client$$resource.call(this, 'panel', oshpark$panel$$default, id);
      };

      Client.prototype.upload = function(id) {
        return oshpark$client$$resource.call(this, 'upload', oshpark$upload$$default, id);
      };

      Client.prototype["import"] = function(id) {
        return oshpark$client$$resource.call(this, 'import', oshpark$import$$default, id);
      };

      Client.prototype.createImport = function(url) {
        return oshpark$client$$argumentPromise(url, 'createImport', 'url').then((function(_this) {
          return function() {
            return oshpark$client$$postRequest.call(_this, 'imports', {
              url: url
            });
          };
        })(this)).then((function(_this) {
          return function(data) {
            return new oshpark$import$$default(data['import'], _this);
          };
        })(this));
      };

      Client.prototype.projectFromImport = function(id) {
        var checkImport;
        checkImport = (function(_this) {
          return function(id, resolve, reject) {
            return _this["import"](id).then(function(_import) {
              if (_import.isProcessing()) {
                return window.setTimeout((function() {
                  return checkImport(id, resolve, reject);
                }), 2000);
              } else if (_import.isSuccessful()) {
                return resolve(_this.project(_import.projectId));
              } else {
                return reject(_import);
              }
            });
          };
        })(this);
        return new RSVP.Promise((function(_this) {
          return function(resolve, reject) {
            return checkImport(id, resolve, reject);
          };
        })(this));
      };

      return Client;

    })();

    var oshpark$client$$default = oshpark$client$$Client;
    var oshpark$$Oshpark;

    oshpark$$Oshpark = {
      Address: oshpark$address$$default,
      Client: oshpark$client$$default,
      Connection: oshpark$connection$$default,
      Image: oshpark$image$$default,
      Import: oshpark$import$$default,
      JQueryConnection: oshpark$jquery_connection$$default,
      Layer: oshpark$layer$$default,
      Order: oshpark$order$$default,
      OrderItem: oshpark$order_item$$default,
      Panel: oshpark$panel$$default,
      Project: oshpark$project$$default,
      ShippingRate: oshpark$shipping_rate$$default,
      Token: oshpark$token$$default,
      Upload: oshpark$upload$$default,
      User: oshpark$user$$default
    };

    window.Oshpark = oshpark$$Oshpark;

    var oshpark$$default = oshpark$$Oshpark;
}).call(this);

//# sourceMappingURL=oshpark.js.map