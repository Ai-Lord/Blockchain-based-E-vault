const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { uniqueId } = require('lodash');

//define the person schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
    
    },
    password: {
        type: String,
        required: true,
    },
    role:{
        type: String,
        enum: ['client', 'lawyer', 'judge']
    }
});

userSchema.pre('save', async function(next){
    const person = this;
    // Hash the password only if it has been modified (or is new)
    if(!person.isModified('password')) return next();

    try{
        // hash password generation
        const salt = await bcrypt.genSalt(10)

        // hash password
        const hashedPassword = await bcrypt.hash(person.password, salt)

        // Override the plain password with the hashed one 
        person.password = hashedPassword;
        next();
    }catch(err){
        return next(err);
    }
})

// use bcrypt to compare the provided password with the hashed password
userSchema.methods.comparePassword = async function(candidatePassword){
    try{
        const isMatch = await bcrypt.compare(candidatePassword, this.password)
        return isMatch;
    }catch(err){
        throw err;
    }
}

const User = mongoose.model('user', userSchema);
module.exports = User;
