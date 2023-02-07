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

  const data = await getProfile(handleName);

  data.profile = getCleanedProfile(data.profile);

  res.render('profile', { user: data.profile })
})

module.exports = router;