# partifys-backend
Group project COMPSCI 732 Backend Server

## Members
1. Aditio Agung Nugroho (anug012 / 791804575)
2. Malith Patabandige (mpat901 / 6544754)
3. Senthil Kumaran Santhosh Gopal (sgop587 / 476621066)
4. Wei Lu (wlu702 / 778099429)

## Description
This project was created for completing group project on COMPSCI 732 course, The University of Auckland. The backend server for party spotify aplication was created using expressjs and socket io. All the signaling process and database connoction is done using RESTfull API call.

## Technologies
- [Expressjs](https://expressjs.com/)
- [Socket IO](https://socket.io/)
- [MongoDB](https://www.mongodb.com/)
- [WebRTC](https://webrtc.org/)

## How to run
```sh
# Create your environment file
cp .env.sample .env

# Replace the placeholder values with your environment values (see next section)
nano .env.sample

# Install dependencies
npm install

# These are helpful scripts

# Run unit tests in watch mode
npm test -- --watch

# Run the server
npm run start
```