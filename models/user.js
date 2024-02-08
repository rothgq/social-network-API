const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
        },
        thoughts: [{
            type: Schema.types.ObjectId,
            ref: 'Thoughts'
        }],
        friends: [{
            type: Schema.types.ObjectId,
            ref: "User"
        }]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true,
        },
        id: false
    }
);

const Users = model('user', userSchema);

userSchema.virtual('friendCount').get(function() {
    return this.friend.length;
})

module.exports = Users;