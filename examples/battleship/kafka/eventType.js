import avro from 'avsc';

/**
 * This is a general purpose event/message serialisation/de-serialisation 
 * procedure that defines the type of messages that are allowed on 
 * a Kafka container.
 * 
 * @author : Manik Jain
 */

export default avro.Type.forSchema({
  type: 'record',
  fields: [
    {
      name: 'category',
      type: { 
          type: 'enum', 
          symbols: ['Battleship'] }
    },
    {
      name: 'name',
      type: 'string',
    }
  ]
});