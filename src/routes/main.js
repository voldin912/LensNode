import express from 'express'
const router = express.Router()
import { getProfile } from '../apis/apolloClient'
import { getCleanedProfile } from '../utils/ipfsCleaningUtility';

router.get('', async (req, res) => {
	res.render('index')
});

router.get('/profile/:name', async (req, res) => {
	const name = req.params.name;
	const handleName = `${ name }.lens`
	const data = await getProfile(handleName);
	if (data && data.profile) {
		const profileData = getCleanedProfile(data.profile);
		res.render('profile', { user: profileData });
	} else {
		res.status(404).render('common/404');
	}
})

router.get('/notifications', async (req, res) => { 
	res.render('notifications')
})

router.use(async (req, res) => { 
	res.status(404).render('common/404');
})

export default router;