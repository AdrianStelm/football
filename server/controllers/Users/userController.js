const User = require('../../models/user')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const {secret} = require('../../../config')

function generateAccesToken(id, role) {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload,secret,{expiresIn:'24h'})
}

class authController {
async registration(req,res) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) return res.status(400).json({messagge:'Error of registration',errors})
        const { username, password, email, role } = req.body;
        const candidate = await User.findOne({ username })
        if (candidate) return res.status(400).json({ messagge: 'This user is already existing' })
        
        const hashPassword = bcrypt.hashSync(password,7)
        const user = new User({ username, email, role: 'user', password: hashPassword})
        await user.save()
        return res.json({messagge:'Succesful registration'})
    } catch (error) {
        console.error(error)
        res.status(400).json({messagge:'Registration error'})
    }
}

async login(req,res) {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username })
        if (!user) return res.status(400).json({ messagge: `User ${username} isn't existing` })
        
        const validPassword = bcrypt.compare(password, user.password)
        if (!validPassword) return res.status(400).json({ messagge: 'Incorrect password' })
        
        const token = generateAccesToken(user._id, user.role)
        return res.json({ token })
    } catch (error) {
        console.error(error)
        res.status(400).json({messagge:'Login error'})
    }
}
async getUsers(req,res) {
    try {
        
    } catch (error) {
        
    }
}
    
}

module.exports = new authController()
