const router = require('express').Router();
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyjwt = require('./verifytoken');

// Registration Endpoint
router.post('/register', async (req, res) => {
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(req.body.password, salt);
    const usernameExists = await User.findOne({username: req.body.username});
    if(usernameExists) {
        return res.status(400).send('Username already exists!');
    }
    const user = new User({
        name: req.body.name,
        username: req.body.username,
        password: hashPassword
    });
    try{
        const savedData = await user.save();
        res.status(201).send(savedData);
    }catch(err){
        res.status(400).send(err);
    }
});


// Login Endpoint
router.post('/login', async (req,res) => {
    const loguser = await User.findOne({username: req.body.username});
    if(loguser) {
        const logpassword = await bcryptjs.compare(req.body.password, loguser.password);
        if(logpassword) {
            const token = jwt.sign({_id: loguser._id}, process.env.TOKEN_SECRET);
            res.header('auth-token', token).send({'status': 'Success', 'token': token});
        } else  {
            return res.status(400).send('Invalid password!');
        }
    } else {
        return res.status(400).send('Invalid username!')
    }
});


// Verify Token
router.get('/verify', verifyjwt, async (req, res) => {
    const userob = await User.findById({_id: req.user._id})
    res.status(200).json({
        "message": "Token Verified!",
        "user_id": userob._id,
        "username": userob.username
    });
});

module.exports = router;