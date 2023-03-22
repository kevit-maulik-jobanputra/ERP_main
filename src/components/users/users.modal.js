const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    designation: {
        type: String,
    },
    dept: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    isAdmin : {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    }
},
{
    timestamps: true
});

const userSignupValidationSchema = {
    firstName : {
        trim: true,
        isLength: {
            options: {min:3},
            errorMessage: "First name must contain atleast 3 alphabets!"
        }
    },
    lastName : {
        trim: true,
        isLength: {
            options: {min:3},
            errorMessage: "Last name must contain atleast 3 alphabets!"
        }
    },
    dept: {
        trim: true,
        isEmpty: {
            negated: true,
            errorMessage: "Dept cannot be empty!"
        }
    },
    password: {
        isStrongPassword: true,
        errorMessage: 'Password must have min 8 characters, 1 lowercase alphabet, 1 uppercase alphabet, 1 numeric alphabet & 1 symbol!'
    },
    email: {
        trim: true,
        isEmail: true,
        errorMessage: "Enter a valid email!",
        custom: {
            options: (value => {
                return User.findOne({email:value})
                .then(user => {
                    if(user){
                        throw new Error('Email already exists!')
                    };
                    return true;
                })
            })
        }
    },
    isAdmin: {
        custom: {
            options: (value => {
                return User.findOne({isAdmin:value})
                .then(user => {
                    if(user){
                        throw new Error('Admin already exists!')
                    };
                    return true;
                })
            })
        }
    }
};

const userLoginValidationSchema = {
    email: {
        trim: true,
        isEmail: true,
        errorMessage: "Enter a valid email!",
    },
    password: {
        isEmpty: {
            negated: true,
            errorMessage: "Password cannot be empty!"
        }
    }
}

userSchema.pre('save', async function (next) {
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 10)
    };
    next();
})

const User = mongoose.model('User', userSchema);

module.exports = { User, userSignupValidationSchema, userLoginValidationSchema };