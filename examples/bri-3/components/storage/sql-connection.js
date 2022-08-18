const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '12212',
    port: 5432,
});

client.connect();

const ordersTable = `CREATE TABLE orders (
    id int,
    price decimal,
    created_at timestamp
);`;

const bpiTable = `CREATE TABLE bpi (
    id int,
    name varchar,
    product_id int,
    created_at timestamp,
    last_updated timestamp
);`;

const workstepsTable = `CREATE TABLE worksteps (
    id int,
    name varchar,
    version varchar
);`;

const bpiTimestampRecordsTable = `CREATE TABLE bpiTimestampRecords (
    id int,
    bpi_id int,
    updated timestamp 
);`;

const stateTable = `CREATE TABLE state (
    id int, --[pk, increment]
    agreementState varchar,
    acceptanceStatus varchar
);`;

const tables = [ordersTable, bpiTable, workstepsTable, bpiTimestampRecordsTable, stateTable]


// client.query(playersQuery, (err, res) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log('Table is successfully created');
//     client.end();
// });

//run a query to run the create tables listed above, included in the tables array
tables.forEach(table => {
    client.query(table, (err, res) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Table is successfully created');
        // client.end();
    });
});

// client.query(ordersTable, (err, res) => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log('Table is successfully created');
//     client.end();
// });
