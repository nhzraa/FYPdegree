const express = require('express')

const scraper = require('./scraper');

const app = express();

app.get('/', (req, res) => {
  res.json({
  	message: 'Data is not here!'
  });
})

app.get('/search/:title', (req, res) => {
  scraper
  .searchRecipes(req.params.title)
  .then(recipes => {
  	res.json(recipes);
  });
})

app.get('/recipe/:allrecipesID', (req, res) => {
  scraper
  .getRecipe(req.params.allrecipesID)
  .then(recipe => {
  	res.json(recipe);
  });
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`listening on ${port}`);
});