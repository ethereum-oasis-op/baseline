import { Circuit, Commitment } from './privacy';

export type Participant = {
  address: string; // public address of the participant
  metadata: object; // arbitrary metadata
  url?: string; // optional url
}

export type Store = {
  identifier?: string; // optional system of record identifier, i.e. document name, UUID or primary key of relational record
  metadata?: object; // arbitrary metadata
  provider: string; // i.e., the system of record persistence provider; see implementations within `core/persistence/providers`
  url?: string; // url referencing the local system of record; i.e. DSN in the case of relational SQL database...
}

export type Model = {
  store: Store;
  name: string; // i.e. collection, table; name of the application-specific record type type
  fields: string | string[] | RegExp; // list of fields and/or selectors (regex) within documents/stream to be baselined
}

export type Workgroup = {
  identifier?: string; // optional workgroup identifier
  metadata?: object; // arbitrary workgroup metadata
  participants: Participant[]; // parties to a workgroup
  workflows: { [key: string]: Workflow };
}

export type Workflow = {
  circuit: Circuit; // reference to the underlying circuit
  commitments: Commitment[]; // commitments[0] is latest commitment (new commitments are prepended to array)
  participants: Participant[]; // subset of parties in a workgroup

  identifier: string; // workflow identifier; should match circuit.id
  shield: string; // shield contract address

  persistence: { [key: string]: Model }; // map of model name to model representing the underlying domain model and its local persistent store (i.e. system of record)
  metadata?: object; // arbitrary workflow metadata
}
