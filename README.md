# ERP_main

To start using this ERP portal:
-> Clone the repo.
-> Run npm install to install all the node modules.
-> Add a .env file to the root of the folder and define and initialize PORT and NODE_ENV variables inside it.
-> Add two files JWT_ADMIN.key and JWT_staff.key to /src/keys folder with different keys in both the files.
-> Run npm run dev from the CLI to start the portal.
-> Import the batch collection from /dump to the database.
-> Import the postman collection to postman app to start calling the REST APIs. 