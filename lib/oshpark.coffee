window.Oshpark =
  modelWithAttributes: (attributes)->
    class Model
      constructor: (json)->
        for attribute in attributes
          @[attribute] = json[attribute] if json[attribute]?

    Model
