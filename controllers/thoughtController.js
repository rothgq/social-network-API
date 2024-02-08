const { Users, Thoughts } = require('../models');

module.exports = {
    createThought(req, res) {
        Thoughts.create(req.body)
        .then(({_id}) => {
            return Users.findOneAndUpdate(
                {_id: req.body.userId},
                {$push: {thoughts: _id}},
                {new: true}
            );
        })
         .then((thought) => !thought
            ? res.status(404).json({ message: 'No user with this ID' }) : res.json(thought))
         .catch((err) => res.status(500).json(err));
    },

    getAllThoughts(req, res) {
        Thoughts.find({})
        .then((thought) => res.json(thought))
        .catch((err) => res.status(500).json(err));
    },

    getOneThought(req, res) {
        Thoughts.findOne({_id: req.params.thoughtId})
        .select('-__v')
        .then((thought) => !thought
            ? res.status(404).json({message: 'No thought with this ID'}) : res.json(thought))
        .catch((err) => res.status(500).json(err));    
    },

    updateThought(req, res) {
        Thoughts.findOneAndUpdate(
            {_id: req.body.thoughtId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
         .then((thought) => !thought
             ? res.status(404).json({ message: 'No thought with this ID' }) : res.json(thought))
         .catch((err) => res.status(500).json(err));
    },

    deleteThought(req, res) {
        Thoughts.findOneAndDelete({_id: req.params.thoughtId})
        .then((thought) => !thought
            ? res.status(404).json({ message: 'No thought with this ID' })
            : Users.findOneAndUpdate(
                {thoughts: req.params.thoughtId},
                {$pull: {thoughts: req.params.thoughtId}},
                {new: true}
            ))
        .then((user) => !user
            ? res.status(404).json({message: 'Thought successfully deleted, but no user found'})
            : res.json({message: 'Thought successfully deleted'})
        )
        .catch((err) => res.status(500).json(err));
    },

    createReaction(req, res) {
        Thoughts.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$addToSet: {reactions: req.body}},
            {runValidators: true, new: true}
        )
        .then((thought) => !thought
            ? res.status(404).json({ message: 'No thought with this ID' }) : res.json(thought))
        .catch((err) => res.status(500).json(err));
    },

    updateReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.body.thoughtId },
            { $set: {reactions: req.params.reactionId}},
            { runValidators: true, new: true }
        )
            .then((thought) => !thought
                ? res.status(404).json({ message: 'No thought with this ID' }) : res.json(thought))
            .catch((err) => res.status(500).json(err));
    },

    deleteReaction(req, res) {
        Thoughts.findOneAndUpdate(
            { _id: req.params.thoughtId },
            { $pull: {reactions: {reactionId: req.params.reactionId}}},
            { runValidators: true, new: true }
        )
        .then((thought) => !thought
            ? res.status(404).json({ message: 'No thought with this ID' }) : res.json(thought))
        .catch((err) => res.status(500).json(err));
    }
};