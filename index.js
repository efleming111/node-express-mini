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

server.post('/api/users', (req, res)=>{
    const body = req.body;
    if(!body.name || !body.bio){
        res.status(400).json({errorMessage: 'Please provide name and bio for the user.'})
    }
    else{
        db.insert(body)
        .then(obj=>{
            db.findById(obj.id)
            .then(user=>{
                res.status(201).json(user);
            })
            // TODO: Don't need this here
            // .catch(error=>{
            //     res.status(404).json({error: 'There was an error while finding new user in database'});
            // });
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
        db.update(id, body)
        .then(count=>{
            if(count){
                db.findById(id)
                .then(user=>{
                    res.status(200).json(user);
                })
                .catch(error=>{
                    res.status(404).json({error: 'There was an error while finding new user in database'});
                });
            }
        })
        .catch(error=>{
            res.status(500).json({error: 'The user information could not be modified.'});
        });
    }
});

server.delete(`/api/users/:id`, (req, res)=>{
    const {id} = req.params;
    db.remove(id)
    .then(rows=>{
        if(!rows){
            res.status(404).json({message: 'The user with the specified ID does not exist.'});
        }
        else{
            // TODO: Check to see if this should return the deleted user
            db.find()
            .then(users=>{
                res.status(200).json(users);
            })
            // TODO: Don't need this here
            // .catch(error=>{
            //     res.status(500).json({error: 'The users information could not be retrieved.'});
            // });
        }
    })
    .catch(error=>{
        res.status(500).json({error: 'The user could not be removed.'});
    });
});

server.listen(4000, ()=>{
    console.log('Server is running on port 4000');
});
