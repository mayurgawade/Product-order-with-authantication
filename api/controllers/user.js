const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../models/user')

// USER : to create user - postAPI
exports.user_create_user = (req, res, next) => {
    User.find({ email: req.body.email })
    .exec()
    .then(
        user => {
            if(user.length > 0) {
                res.status(409).json({
                    message : "email already exist"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if(err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id : new mongoose.Types.ObjectId(),
                            email : req.body.email,
                            password : hash
                        })
                    user.save()
                    .then( result => {
                        return res.status(201).json({
                            message: 'User added successfully',
                            userDetails: result
                        })
                    })
                    .catch(
                        err => {
                            return res.status(500).json({
                                error: err
                            })
                        }
                    )
                }
                })
            }
        }
    )
    .catch(
        err => {
            return res.status(500).json({
                error: err
            })
        }
    )
}

// USER : for Login user into application - postAPI
exports.user_login = (req, res, next) => {
    User.find({ email: req.body.email})
    .exec()
    .then(
        user => {
            if(user.length < 1){
                return res.status(401).json({
                    message : 'Authantication Failed'
                })
            } 
            bcrypt.compare(req.body.password, user[0].password, (err, result) => {
                if(err){
                    return res.status(401).json({
                        message : 'Authantication Failed'
                    })
                } 
                if (result){
                    const token = jwt.sign(
                    {
                        email: user[0].email,
                        userId: user[0]._id
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: "1h"
                    }
                    );
                    return res.status(200).json({
                        message : 'Authantication Successful',
                         token : token
                    })
              }
                res.status(401).json({
                    message : 'Authantication Failed'
                })
             })
        }
    )
    .catch(
        err => {
            return res.status(500).json({
                error: err
            })
        }
    )
}

// USER : to delete user - deleteAPI
exports.user_delete_user = (req, res, next) => {
    User.remove({_id: req.params.userId})
    .exec()
    .then(
        result => {
            res.status(200).json({
                message : 'user Deleted',
                result : result
            })
        }
    )
    .catch(
        err => {
            res.status(500).json({
                error: err
            })
        }
    )
}
