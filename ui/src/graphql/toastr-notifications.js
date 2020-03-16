import gql from 'graphql-tag';

export const INCOMING_TOASTR_NOTIFICATION = gql`
  subscription onNotification($userAddress: Address!) {
    onNotification(userAddress: $userAddress) {
      success
      message
    }
  }
`;
