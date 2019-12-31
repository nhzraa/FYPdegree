const express = require('express')
const db = require('./recipeDB');
const app = express();

const scraper1 = require('./scraper1');
const scraper2 = require('./scraper2');
const scraper3 = require('./scraper3');
const scraper4 = require('./scraper4');


app.get('/', (req, res) => {
  res.json({
  	message: 'Data is not here!'
  });
})

app.get('/searchF/', (req, res) => 
{
  scraper1
  .searchRecipes(req.params.p)
  .then(recipes => 
  {
  	res.json(recipes);
  });
})

app.get('/searchAR/', (req, res) => 
{
  scraper2
  .searchRecipes(req.params.p)
  .then(recipes => 
  {
    res.json(recipes);
  });
})

app.get('/searchEpi/', (req, res) => 
{
  scraper3
  .SearchEpiRecipes(req.params.p)
  .then(recipes => 
  {
    res.json(recipes);
  });
})

//testing scrape
app.get('/searchTest/', (req, res) => 
{
  scraper4
  .searchRecipes(req.params.p)
  .then(recipes => 
  {
    res.json(recipes);
  });

  scraper4
  .getRecipe(req.params.allrecipesID)
  .then(recipes =>
  {
    res.json(recipes);
  })
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`listening on ${port}`);
});