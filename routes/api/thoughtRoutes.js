const router = require('express').Router();

const {
    createThought,
    getAllThoughts,
    getOneThought,
    updateThought,
    deleteThought,
    createReaction,
    updateReaction,
    deleteReaction,
} = require('../../controllers/thoughtController');

router.route('/').get(getAllThoughts).post(createThought);

router.route('/:thoughtId').get(getOneThought).put(updateThought).delete(deleteThought);

router.route('/:thoughtId/reactions').post(createReaction);

router.route('/:thoughtId/reactions/:reactionsId').put(updateReaction).delete(deleteReaction);

module.exports = router;