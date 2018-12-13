const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// Load user model
const User = require('../../models/Users');

// @route   GET api/users/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => {
    console.log("[users] /test ");
    res.json({msg: "Users works"})
});

// @route   GET api/users/register
// @desc    REgister user
// @access  Public
router.post('/register', (req, res) => {
    
    console.log("[users] /register email: ", req.body.email);
    console.log("[users] /register name: ", req.body.name);
    console.log("[users] /register password: ", req.body.password);

    User.findOne({ email: req.body.email })
        .then(user => {
            if(user) {
                return res.status(400).json({email: 'Email already exists'});
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200', // Size
                    r: 'pg',  // Rating
                    d: 'mm',  // Default
                })
                console.log("[users] /register avatar: ", avatar);
                
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password,
                });

                bcrypt.genSalt(10, (err, salt) => {      // 10 char salt
                    if (err) throw err;
                    bcrypt.hash(newUser.password, salt, (err, hash) => {    // Auto-gen a salt and hash, return the hash or err
                        if(err) throw err;
                        newUser.password = hash;                // assign salted password to db password field
                        newUser.save()                          // save new user to db
                            .then(user => res.json(user))       // return response to user info
                            .catch(err => console.log(err));
                    });
                })

            }
        })
});
module.exports = router;
