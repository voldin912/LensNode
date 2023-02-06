const express = require('express')
const router = express.Router()
const { getProfile } = require('../apis/apolloClient')

router.get('', async (req, res) => {
	res.render('index')
});

router.get('/profile/:name', async (req, res) => { 
	let name = req.params.name;
	let handleName = name + '.lens'

	const data = await getProfile(handleName);
  const profData = JSON.stringify(data, undefined, 2);
  
  //Logging data that it is there
  console.log(profData);

  res.render('profile')
})

module.exports = router;