const connection = require('./recipeDB');
const mysql = require('mysql');

const fetch = require ('node-fetch');
const cheerio = require('cheerio');

const foodSearchUrl = 'https://food52.com/recipes/search?tag=test-kitchen-approved&page=';
const allfoodURL = 'https://food52.com/';

const recipes = [];

//////////////////////////////////////////////////////////////////////
//untuk loop pages scraping//

async function searchRecipes (p) {
  var p;
  
  for (p=180; p<190; p++) 
  {
    console.log("Scraping page :"+p);
    await searchRecipesFunc(recipes,p);
  }

  // throw(err);

  return recipes;
}

//////////////////////////////////////////////////////////////////////
//untuk scrape outer - search results based on page yg dah set//

function searchRecipesFunc(recipes,p) {
  return fetch (`${foodSearchUrl}${p}`)
    .then(response => response.text())
    .then(body => { 

   
    const $ = cheerio.load(body);

    console.log("length: " +$('div[class="card collectable-tile js-collectable-tile js-quick-basket"]').length);

    $('div[class="card collectable-tile js-collectable-tile js-quick-basket"]').each(function(i, element) 
      {
        const $element = $(element); 
        const $title = $element.find('div h3 a');
        const $link = $element.find('div h3 a');
        const $image = $element.find ('div a img');
        const image = $image.attr('src');
        const foodID = $link.attr('href').match(/recipes\/.*/)[0];
        
        getRecipe(foodID);
      });
  }); 
}

//////////////////////////////////////////////////////////////////////
//untuk dapatkan detailed infos//

function getRecipe (foodID)
  {
    return fetch (`${allfoodURL}${foodID}`)
      .then(response => response.text())
      .then(body => {
         
        const ingredients = [];
        const directions = [];

        const $ = cheerio.load(body);

        const $title = $('.recipe div header h1');
        const title = $title.text();
        
        const link = (`${allfoodURL}${foodID}`);
        
        const $image = $('.img__pin');
        const image = $image.attr('data-pin-media');
        
        $('.recipe__list ul li').each(function(i, element) {

          const ingredient = $(element).text();
          ingredients.push(ingredient);
        }); 
        const ingre = ingredients.join(','); 

        $('li[class="recipe__list-step"]').each(function(i, element) {

          const direction = $(element).text();
          directions.push(direction);
        });
        const dir = directions.join(',');

        const recipe =
        {
            foodID,
            title,
            link,
            image,
            // calories,
            // prepTime,
            ingre,
            dir
        }

        recipes.push(recipe);
        // console.log(recipes);
        console.log("Total Num of Recipes: " + recipes.length);
        
        var newrecipe  = {recipeID:recipe.foodID, title:recipe.title, link:recipe.link, image:recipe.image, ingredients:recipe.ingre, directions:recipe.dir };
        // console.log("INSERT INTO recipes (recipeID, title, link, image, calories, prepTime, ingredients, directions) VALUES ?,?,?,?,?,?,?,?", (recipe.allrecipesID,recipe.title,recipe.link,recipe.image,recipe.calories, recipe.prepTime, recipe.ingre, recipe.dir))
        connection.query("INSERT INTO recipes SET ?", newrecipe, (err,rows) => {
          if(err) 
          {
            console.log("Error in SQL");
            console.log('\n');
            console.error(err.message);
            //throw err;
          }
          else 
          {
            console.log('Recipe:\n');
            console.log(rows);
          }


        });
      
        return recipes;
    });
}

//////////////////////////////////////////////////////////////////////

  module.exports = 
  {
    searchRecipes,
    getRecipe
  };

//////////////////////////////////////////////////////////////////////