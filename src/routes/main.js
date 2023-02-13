import { getProfile, getPublications } from '../apis/apolloClient'
import { getCleanedProfile } from '../utils/ipfsCleaningUtility';
import { text_truncate } from '../utils/text_truncate';
import moment from 'moment'
import linkifyHtml from "linkify-html";
import 'linkify-plugin-hashtag'
import 'linkify-plugin-mention'

export default router => {
	router.get('', async (req, res) => {
		const data = await getPublications();
		res.render('index', { articles: data, moment: moment, linkifyHtml: linkifyHtml, text_truncate: text_truncate })
	});

	router.get('/profile/:name', async (req, res) => {
		const name = req.params.name;
		const handleName = `${name}.lens`
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
}