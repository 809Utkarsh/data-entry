to start
create all modules
or clone
# npm i
node index.js

// how to setup mongodb
Open the MongoDB Shell:

Open your terminal (or Command Prompt) and type:
mongo
Create a New Database:

Switch to a new database by typing:

use myNewDatabase
Replace myNewDatabase with the name you want for your new database. Note that MongoDB does not actually create the database until you insert data into it.
Insert Data to Create the Database:

To create the database, insert at least one document into a collection within this database. For example:

db.myCollection.insertOne({ name: "test" })


