`import Address from 'oshpark/address'`
`import Client from 'oshpark/client'`
`import Connection from 'oshpark/connection'`
`import Image from 'oshpark/image'`
`import Import from 'oshpark/import'`
`import JQueryConnection from 'oshpark/jquery_connection'`
`import Layer from 'oshpark/layer'`
`import Order from 'oshpark/order'`
`import Panel from 'oshpark/panel'`
`import Project from 'oshpark/project'`
`import ShippingRate from 'oshpark/shipping_rate'`
`import Token from 'oshpark/token'`
`import Upload from 'oshpark/upload'`
`import User from 'oshpark/user'`

Oshpark =
  Address:          Address
  Client:           Client
  Connection:       Connection
  Image:            Image
  Import:           Import
  JQueryConnection: JQueryConnection
  Layer:            Layer
  Order:            Order
  Panel:            Panel
  Project:          Project
  ShippingRate:     ShippingRate
  Token:            Token
  Upload:           Upload
  User:             User

window.Oshpark = Oshpark

`export default Oshpark`
