const { Users, Thoughts } = require('../models');

module.exports = {
    createUser(req, res) {
        Users.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    getAllUsers(req, res) {
        Users.find({})
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    getOneUser(req, res) {
        Users.findOne({_id: req.params.userId})
        .populate('thoughts')
        .populate('friends')
        .select('-__v')
        .then((user) => !user
            ? res.status(404).json({ message: 'No user with this ID' }) : res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    updateUser(req, res) {
        Users.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
        .then((user) => !user
            ? res.status(404).json({ message: 'No user with this ID' }) : res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    deleteUser(req, res) {
        Users.findOneAndDelete({_id: req.params.userId})
        .then((user) => !user
            ? res.status(404).json({message: 'No user with this ID'}) : Thoughts.deleteMany({_id: {$in: user.thoughts}}))
        .then(() => res.json({message: 'Selected user and all thoughts'}))
        .catch((err) => res.status(500).json(err));
    },

    addFriend(req, res) {
        Users.findOneAndUpdate(
            {_id: req.params.userId},
            {$addToSet: {friends: req.params.friendId}},
            {runValidators: true, new: true}
        )
        .then((user) => !user
            ? res.status(404).json({ message: 'No user with this ID' }) : res.json(user))
        .catch((err) => res.status(500).json(err));
    },

    deleteFriend(req, res) {
        Users.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friends: req.params.friendId}},
            {new: true}
        )
        .then((user) => !user
            ? res.status(404).json({ message: 'No user with this ID' }) : res.json(user))
        .catch((err) => res.status(500).json(err));
    }
};