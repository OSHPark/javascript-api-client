camelize = (str)->
  str.replace /_([a-z])/g, (g)-> g[1].toUpperCase()

window.Oshpark =
  modelWithAttributes: (attributes)->
    class Model
      constructor: (json,client=undefined)->
        @client    = client
        @__attrs__ = json
        for attribute in attributes
          camelized = camelize(attribute)
          @[camelized] = json[attribute] unless @[camelized]?

    Model
