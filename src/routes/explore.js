
export default router => {
  router.get('/explore', async (req, res) => {
      res.render('explore')
  });
}