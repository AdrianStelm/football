const User = require('../../models/user')
const bcrypt = require('bcrypt')
const { validationResult } = require('express-validator')
const jwt = require('jsonwebtoken')
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { secret } = require('../../../config')
const crypto = require('crypto');
const transporter = require('../email');

passport.use(new GoogleStrategy({
    clientID: '921308896536-tfe725f1ruq3kakn1i5vrernm0uuhqqp.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/auth/google/callback',
  },
  async ( profile, done) => {
    try {
      let user = await User.findOne({ email: profile.emails[0].value });
      if (user) return res.status(400).json({ messagge: `User is already existing` })
      if (!user) {
        user = new User({
          username: profile.displayName,
          email: profile.emails[0].value,
          role: 'User',
          password: bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), 7)
        });
        await user.save();
      }
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

function generateAccessToken(id, role) {
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
        const { username, password, email } = req.body;
        const candidate = await User.findOne({ username })
        if (candidate) return res.status(400).json({ messagge: 'This user is already existing' })
        
        const hashPassword = bcrypt.hashSync(password,7)
        const user = new User({ username, email, role: 'User', password: hashPassword})
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
        
        const validPassword = await bcrypt.compare(password, user.password)
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
        const users = await User.find();
        res.json(users)
    } catch (error) {
        console.error(error)
    }
}

async retrievePassword(req, res) {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ messagge: `User with such email: ${email} isn't existing` })    
        
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 година
        await user.save();

        const resetUrl = `http://${req.headers.host}/reset-password/${token}`;
        const mailOptions = {
            to: user.email,
            from: 'hello@demomailtrap.co',
            subject: 'Відновлення паролю',
            html: `
        <p>Ви отримали цей лист, тому що хтось (можливо ви) запросив скидання паролю для вашого акаунту.</p>
        <p>Будь ласка, перейдіть за посиланням для зміни паролю:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>Якщо ви не запитували скидання паролю, проігноруйте цей лист.</p>
      `
     };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Лист для відновлення паролю відправлено' });
    
} catch (error) {
    console.error(error)
}    
}
    
async updatePassword(req, res) {
    try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: 'Token is undefined or token date was expired' });

    const { newPassword } = req.body;
    const hashPassword = bcrypt.hashSync(newPassword,7)
    user.password = hashPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password was succesfully changed' });
  } catch (error) {
        res.status(500).json({ message: 'Internal error' });
        console.log(error)
  }
}
       
async loginWithGoogle(req, res) {
try {
      if (!req.user) {
        return res.redirect('/login?error=google_auth_failed');
      }

      const token = generateAccessToken(req.user._id, req.user.role);
      res.json({ token });
    } catch (error) {
      console.error('Google auth error:', error);
      res.redirect('/login?error=server_error');
    }
}
    
}

module.exports = new authController()
