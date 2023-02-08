const express = require('express')
const router = express.Router()
const { getProfile } = require('../apis/apolloClient')
const { getCleanedProfile } = require('../utils/ipfsCleaningUtility');
router.get('', async (req, res) => {
	res.render('index')
});

router.get('/profile/:name', async (req, res) => { 
	let name = req.params.name;
	let handleName = name + '.lens'
	let data = await getProfile(handleName);
	let profileData = getCleanedProfile(data.profile);
	res.render('profile', { user: profileData })
})

router.use(async (req, res) => { 
	res.status(404).render('common/404');
})
module.exports = router;