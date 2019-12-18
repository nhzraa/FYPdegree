const express = require('express')
const db = require('./recipeDB');
const app = express();

const scraper1 = require('./scraper1');
const scraper2 = require('./scraper2');
const scraper3 = require('./scraper3');
const scraper4 = require('./scraper4');

/*const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password5197_',
    database: 'recipeapp'
});

connection.connect(function(err) {
  if (err) {
    return console.error('error: ' + err.message);
  }
 
  console.log('Connected to the MySQL server.');
});
*/

//db.execute('SELEECT * FROM recipes');

app.get('/', (req, res) => {
  res.json({
  	message: 'Data is not here!'
  });
})


//search 3 websites
app.get('/searchF/', (req, res) => 
{
  scraper1
  .searchFoodRecipes(req.params.p)
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

//done scrape all recipes from Epicurious Website
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

})

/*module.exports = (req, res, next) => 
{
  scraper4
  .getRecipes (req.params.allrecipesID)
  .then(recipes =>
  {
    const title = req.body.title;
    const link = req.body.link;
    const image = req.body.image;
    const allrecipesID = req.body.allrecipesID;
    const calories = req.body.calories;
    const prepTime = req.body.prepTime;
    const ingredients = req.body.ingredients;
    const directions = req.body.directions;

    const recipe = new Recipe (title, link, image, allrecipesID, calories, prepTime, ingredients, directions);
    recipe.save();
  })
  
}*/


////////////////////////////////////////////////////////////////////////////

//getRecipes 3 websites
app.get('/recipeF/:foodID', (req, res) => {
  scraper1
  .getFoodRecipe(req.params.epiID)
  .then(recipe => {
    res.json(recipe);
  });
})

app.get('/recipeAR/:allrecipesID', (req, res) => {
  scraper2
  .getRecipe(req.params.allrecipesID)
  .then(recipe => {
    res.json(recipe);
  });
})

app.get('/recipeEpi/:epiID', (req, res) => {
  scraper3
  .getEpiRecipe(req.params.epiID)
  .then(recipe => {
    res.json(recipe);
  });
})


const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`listening on ${port}`);
});