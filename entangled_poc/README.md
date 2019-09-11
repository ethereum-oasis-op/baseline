# Entanglement POC
This app is part of an interactive proof of concept app that should demonstrate the concept of "data entanglement" (as defined by John Wolpert).

The application is a nodejs based react app that allows a user to interact with a single entangled field. This single data field is stored in separate databases (though for the demo, the databases share the same host) that are owned by three different parties; Buyer 1, Supplier 1, and Supplier 2. 

## The supported use case workflow

The POC is intended to show the three parties mentioned above in a workflow like this:

Buyer 1 is the "owner" of the data field and is allowed to change the data. Supplier 1 and Supplier 2 are subscribed to the updates of the field.

Supplier 1 and 2 are "users" of the data, they can only read it. They are both subscribed to updates on the field from Buyer1. They both have copies of the subscribed field value in their databases that they want to keep up-to-date.

When Buyer 1 changes the field value (in the POC this will be manually, through the web UI) they update their local value of the entangled field, the two subscribed parties will get sent a copy of the updated field value. It is then, up to Supplier 1 and Supplier 2 if they want to accept the change. We expect that almost always this change will be accepted but for demonstration purposes we leave it up to the Supplier 1/2 users to decide (via 'accept/reject' buttons in the UI).

## Technical approach
