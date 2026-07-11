const express = require('express');
const router = express.Router();
const { searchUsers, getContacts, addContact, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/search', searchUsers);
router.get('/contacts', getContacts);
router.post('/contacts/:userId', addContact);
router.put('/profile', updateProfile);

module.exports = router;
