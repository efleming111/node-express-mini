const express = require('express');

const db = require('./data/db');

const server = express();
server.use(express.json());

server.get('/api/users', (req, res)=>{
    db.find()
    .then(users=>{
        res.status(200).json(users);
    })
    .catch(error=>{
        res.status(500).json({error: 'The users information could not be retrieved.'});
    });
});

server.get('/api/users/:id', (req, res)=>{
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

// TODO: Thursday's lecture
server.post('/api/users', (req, res)=>{
    const body = req.body;
    if(!body.name || !body.bio){
        res.status(400).json({errorMessage: 'Please provide name and bio for the user.'})
    }
    else{
        db.insert(body)
        .then(obj=>{
            // TODO: See if this needs revised
            db.findById(obj.id)
            .then(user=>{
                res.status(201).json(user);
            })
            .catch(error=>{
                res.status(404).json({error: 'There was an error while finding new user in database'});
            });
        })
        .catch(error=>{
            res.status(500).json({error: 'There was an error while saving the user to the database'});
        });
    }
});

server.put('/api/users/:id', (req, res)=>{
    const {id} = req.params;
    const body = req.body;
    if(!body.name || !body.bio){
        res.status(400).json({errorMessage: 'Please provide name and bio for the user.'});
    }
    else{
        // TODO: Start here
        db.update(id, body)
        .then(test=>{
            console.log(test);
            res.status(200).json({message: 'This works just testing param value'});
        })
        .catch(error=>{
            res.status(500).json({error: 'The user information could not be modified.'});
        });
    }

    res.status(200).json({url: `/api/users/${id}`, operation: 'PUT'});
});

server.delete(`/api/users/:id`, (req, res)=>{
    const {id} = req.params;
    db.remove(id)
    .then(rows=>{
        if(!rows){
            res.status(404).json({message: 'The user with the specified ID does not exist.'});
        }
        else{
            // TODO: See if this needs revised
            db.find()
            .then(users=>{
                res.status(200).json(users);
            })
            .catch(error=>{
                res.status(500).json({error: 'The users information could not be retrieved.'});
            });
        }
    })
    .catch(error=>{
        res.status(500).json({error: 'The user could not be removed.'});
    });
});

server.listen(4000, ()=>{
    console.log('Server is running on port 4000');
});
