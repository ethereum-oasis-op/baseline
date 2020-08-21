import gql from 'graphql-tag';

export const GET_SERVER_STATUS = gql`
query GetServerStatus {
  serverStatus {
    balance
  }
}
`;

export const GET_SERVER_STATUS_UPDATE = gql`
subscription GetServerStatusUpdate{
  serverStatusUpdate {
    balance
  }
}
`;
