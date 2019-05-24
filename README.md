# Customers-Management
simple Angular 7 app to manage customers with node js server
repo has 2 directories , client and server side 
to run the production version check readme of server folder
to run client side only check client read me 

# Pre-reqs
To build and run this app locally you will need a few things:
- Install [Node.js](https://nodejs.org/en/)
- Install [MongoDB](https://docs.mongodb.com/manual/installation/)
- Install [VS Code](https://code.visualstudio.com/)

# Getting started
- Clone the repository
```
git clone https://github.com/ahmadkhalaf1/Customers-Management Customers-Management
```
- Install dependencies
```
cd Customers-Management
there is 2 directories , client and server
cd into each one then
npm install
```
- Configure your mongoDB server
```bash
# create the db directory
sudo mkdir -p /data/db
# give the db correct read/write permissions
sudo chmod 777 /data/db
```
- Start your mongoDB server (you'll probably want another command prompt)
```
mongod
```
- Build and run the project
```
cd to client
npm run build
cd to server
npm run start
```
navigate to `http://localhost:3500` and you should see the template being served and rendered locally by node js!
