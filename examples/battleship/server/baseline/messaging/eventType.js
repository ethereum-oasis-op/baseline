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
      name: 'shieldContractAddress',
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

const gameEventType = avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'id',
      type: 'string'
    },
    {
      name: 'players',
      type: {
        type: 'array',
        items : {
          name: 'player',
          type: 'record',
          fields: [
            {
              name: 'id',
              type: 'string'
            },
            {
              name: 'hash',
              type: {
                type: 'array',
                items: 'string'
              },
              default: []
            }
          ]
        },
        default: []
      }
    }
  ]
});

const targetEventType = avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'x',
      type: 'int'
    },
    {
      name: 'y',
      type: 'int'
    },
    {
      name: 'playerId',
      type: 'string'
    },
    {
      name: 'gameId',
      type: 'string'
    }
  ]
});


const proofEventType = avro.Type.forSchema({
  type: "record",
  fields: [
    {
      name: "proof",
      type: {
        name: "proof",
        type: "record",
        fields: [
          {
            name: "pi_a",
            type: {
              type: "array",
              items: "string"
            }
          },
          {
            name: "pi_b",
            type: {
              type: "array",
              items: {
                type: "array",
                items: "string"
              }
            }
          },
          {
            name: "pi_c",
            type: {
              type: "array",
              items: "string"
            }
          },
          {
            name: "protocol",
            type: "string"
          },
          {
            name: "curve",
            type: "string"
          }
        ]
      }
    },
    {
      name: "publicSignals",
      type: {
        type: "array",
        items: "string"
      }
    },
    {
      name: 'playerId',
      type: 'string'
    },
    {
      name: 'gameId',
      type: 'string'
    }
  ]
});

module.exports = {
  orgEventType,
  workgroupEventType,
  gameEventType,
  targetEventType,
  proofEventType
}