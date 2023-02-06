const express = require('express')
const router = express.Router()


const { ApolloServer } = require("apollo-server")
const { gql } = require("apollo-server")

router.get('', async (req, res) => {
	res.render('index')
});

router.get('/profile/:name', async (req, res) => { 
  res.render('profile')
})

module.exports = router;