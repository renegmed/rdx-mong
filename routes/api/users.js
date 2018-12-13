const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');

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

            }
        })
});
module.exports = router;
