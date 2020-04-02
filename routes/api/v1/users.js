module.exports.controller = (app) => {
    // get users
    
    app.get(process.env.EXPRESS_API_VERSION + '/users', (req, res) => {
        res.send('This is get users api!');
    })
}