const avro = require('avsc');

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
    }
  ]
});

const workgroupEventType = avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'id',
      type: 'string'
    },
    {
      name: 'players',
      type: {
        type: "array",
        items : "string",
        default: []
      }
    }
  ]
});

module.exports = {
  orgEventType,
  workgroupEventType
}