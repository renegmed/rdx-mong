const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

// Load user model
const User = require('../../models/Users');

// @route   GET api/users/test
// @desc    Test post route
// @access  Public
router.get('/test', (req, res) => {
    console.log("[users] /test ");
    res.json({msg: "Users works"})
});

// @route   POST api/users/register
// @desc    REgister user
// @access  Public
router.post('/register', (req, res) => {
    
    // console.log("[users] /register email: ", req.body.email);
    // console.log("[users] /register name: ", req.body.name);
    // console.log("[users] /register password: ", req.body.password);

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
                // console.log("[users] /register avatar: ", avatar);
                
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



// @route   POST api/users/login
// @desc    Login User / Returning JWT token
// @access  Public
router.post('/login', (req, res) => {

    console.log("[users] /login email: ", req.body.email);

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({email})
        .then(user => {
            // Check of user
            if(!user) {
                return res.status(404).json({email: 'User not found'});
            }

            // Check Password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        // User matched
                        const payload = {id: user.id, name: user.name, avatar: user.avatar}  // create JWT payload

                        console.log("[users] /login keys.secret:", keys.secret);

                        // Sign Token
                        jwt.sign(payload, keys.secret, { expiresIn:3600}, (err, token) => { // expires an hour
                             
                            console.log("[users] /login token:", token);
                            if (err) {
                                console.log(err);
                                return res.status(400).json({msg: 'Problem generating token.'})
                            }
                            
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            });                             
                        });  
                        
                    } else {
                        return res.status(400).json({password: 'Password incorrect'});
                    }
                })
        });
});

module.exports = router;
