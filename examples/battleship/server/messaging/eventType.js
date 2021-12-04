const avro = require('avsc');

/**
 * This is a general purpose event/message serialisation/de-serialisation 
 * procedure that defines the type of messages that are allowed on 
 * a Kafka container.
 * 
 * @author : Manik Jain
 */

const orgEventType = avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'id',
      type: 'string'
    },
    {
      name: 'name',
      type: 'string'
    },
    {
      name: 'hash',
      type: {
        type: "array",
        items : "string",
        default: []
      }
    }
  ]
});

module.exports = {
  orgEventType
}