const { v4: uuid } = require('uuid');

module.exports.controller = (app) => {
    let users = {
        user1: {
            id: uuid(),
            name: "Aditio",
            email: "aditio@gmail.com",
            password: uuid(),
            token: uuid()
        },
        user2: {
            id: uuid(),
            name: "wei",
            email: "wei@gmail.com",
            password: uuid(),
            token: uuid()
        },
        user3: {
            id: uuid(),
            name: "Aditio",
            email: "malith@gmail.com",
            password: uuid(),
            token: uuid()
        },
        user4: {
            id: uuid(),
            name: "Aditio",
            email: "santosh@gmail.com",
            password: uuid(),
            token: uuid()
        }
    }


    // Create a new user
    app.post(process.env.EXPRESS_API_VERSION + '/users', (req, res) => {
        // some code to add user

        res.end(JSON.stringify(req.body));  
    })

    // Get all users
    app.get(process.env.EXPRESS_API_VERSION + '/users', (req, res) => {
        res.end(JSON.stringify(users));  
    })

    // Get users by Id
    app.get(process.env.EXPRESS_API_VERSION + '/users/:id', (req, res) => {
        res.end(JSON.stringify(users["user" + req.params.id]));  
    })

    // Update a user with Id
    app.put(process.env.EXPRESS_API_VERSION + '/users/:id', (req, res) => {
        // some code to update user

        res.end(JSON.stringify(users["user" + req.params.id]));  
    })
 
    // Delete a user with Id
    app.put(process.env.EXPRESS_API_VERSION + '/users/:id', (req, res) => {
        // some code to delete user

        res.end(JSON.stringify(users["user" + req.params.id]));  
    })
}