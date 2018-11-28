const express = require('express');

const db = require('./data/db');

const server = express();

server.get('/api/users', (req, res)=>{
    db.find()
    .then(users=>{
        res.status(200).json(users);
    })
    .catch(error=>{
        res.status(500).json({error: 'The users information could not be retrieved.'});
    });
});

server.get(`/api/users/:id`, (req, res)=>{
    const {id} = req.params;
    db.findById(id)
    .then(user=>{
        if(user){
            res.status(200).json(user);
        }
        else{
            res.status(404).json({message: 'The user with the specified ID does not exist.'});
        }
    })
    .catch(error=>{
        res.status(500).json({error: 'The user information could not be retrieved.'});
    });
});

server.listen(4000, ()=>{
    console.log('Server is running on port 4000');
});
