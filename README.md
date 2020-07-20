[![Build Status](https://travis-ci.com/aditioan/partifys-backend.svg?branch=master)](https://travis-ci.com/aditioan/partifys-backend.svg?branch=master) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

# PARTIFYS PROJECT
#### [https://partifys.herokuapp.com/](https://partifys.herokuapp.com/)
Group project COMPSCI 732 Back-end repository

![screenshot](./public/group_project.png)

## Members
1. Aditio Agung Nugroho (anug012 / 791804575)
2. Malith Patabandige (mpat901 / 6544754)
3. Senthil Kumaran Santhosh Gopal (sgop587 / 476621066)
4. Wei Lu (wlu702 / 778099429)

## Description
This project was created for the group project in the COMPSCI 732 course, at The University of Auckland. We utilize Spotify open API to create a website to host a “Party Playlist” using a Spotify premium account. The users must have a Spotify premium account to create the room. The backend server for party spotify aplication was created using expressjs, WebRTC and socket io. All the signaling process and database connection is done using RESTfull API call.


## Main Features
- Users can log in using their Spotify account (Premium account). 
- Users can create a “room” using name and code. 
- Users can share this room with friends using the party name + code or QR scan. 
- Users who enter the room can search and add songs to the room’s playlist. 
- Guests who enter the room can add a song and vote between two songs in the playlist to determine which one will be played next. 
- Users who have entered the room can chat with each other.

## Documentation
- [Project Meeting Minutes](https://share.nuclino.com/p/Partifys-Meeting-Minutes-Bronze-Bear-PDraCqJpRPWNCj8_Sdny3z)
- [Task Breakdown](https://share.nuclino.com/p/Task-Breakdown-Bronze-Bear-4ooamYE02NkzOKrF760y5d)
- [Partifys Tutorial](https://share.nuclino.com/p/Partifys-Tutorial-Bronze-Bear-T3vQlNFx-vqwT7_pyoEoao)


## Technologies
- [Expressjs](https://expressjs.com/)
- [Socket IO](https://socket.io/)
- [MongoDB](https://www.mongodb.com/)
- [WebRTC](https://webrtc.org/)

## How to run
```sh
# Create your environment file
cp .env.sample .env

# You can use our environtment setting by default. 
# However, you can replace the placeholder values with your environment values (see next section)
nano .env.sample

# Install dependencies
npm install

# These are helpful scripts

# Run unit tests in watch mode
npm test -- --watch

# Run the server
npm start
```

## Creating the environment file

**Creating a MongoDB Atlas cluster**

- Follow this MongoDB Atlas official tutorial for [Creating a new cluster](https://docs.atlas.mongodb.com/tutorial/create-new-cluster/)
- Once the cluster is created, create a database user
- Enter your database user credentials
- Whitelist your IP Address to limit access to the database from your machine (this is optional; if no IP is added, any machine will be able to connect)
- Create database collections
- View connection to cluster, choose connect by applicatoin
- Save a `connection string` and copy it in your env file

**Creating a JWT Secret Key**
- You can generate using ssh-gen or [Online Web key generator](https://mkjwk.org/)
