const connection = require('./recipeDB');
const mysql = require('mysql');

const fetch = require ('node-fetch');
const cheerio = require('cheerio');

const ARsearchUrl = 'https://www.allrecipes.com/search/?page=';
const allrecipesUrl = 'https://www.allrecipes.com/recipe/';

const recipes = [];

//////////////////////////////////////////////////////////////////////
//untuk loop pages scraping//

async function searchRecipes (p) {
  var p;
  
  for (p=2; p<10; p++) 
  {
    console.log("Scraping page :"+p);
    await searchRecipesFunc(recipes,p);
  }
}

//////////////////////////////////////////////////////////////////////
//untuk scrape outer - search results based on page yg dah set//

function searchRecipesFunc(recipes,p) {
  return fetch (`${ARsearchUrl}${p}`)
    .then(response => response.text())
    .then(body => { 

   
    const $ = cheerio.load(body);

    console.log("length: " +$('.fixed-recipe-card').length);
    
    $('.fixed-recipe-card').each(function(i, element) {
      const $element = $(element); 
      const $title = $element.find('div h3 a span');
      const $link = $element.find('div h3 a');

      const allrecipesID = $link.attr('href').match(/recipe\/(.*)\//)[1];

      getRecipe(allrecipesID);
    });
  }); 
}

//////////////////////////////////////////////////////////////////////
//untuk dapatkan detailed infos//

function getRecipe (allrecipesID)
  {
    return fetch (`${allrecipesUrl}${allrecipesID}`)
      .then(response => response.text())
      .then(body => {
         
        const ingredients = [];
        const directions = [];

        const $ = cheerio.load(body);

        const $title = $('.recipe-summary h1');
        const title = $title.text();
        
        const link = (`${allrecipesUrl}${allrecipesID}`);
        
        const $image = $('.summary-background div section div div a img');
        const image = $image.attr('src');
        
        const $calories = $('.calorie-count');
        const calories = $calories.text();
        
        const $prepTime = $('.ready-in-time');
        const prepTime = $prepTime.text();
        
        $('span[itemprop="recipeIngredient"]').each(function(i, element) {

          const ingredient = $(element).text();
          ingredients.push(ingredient);
        });

        const ingre = ingredients.join(','); 
        
        $('span[class="recipe-directions__list--item"]').each(function(i, element) {

          const direction = $(element).text();
          directions.push(direction);
        });

        const dir = directions.join(',');
        
        const recipe =
        {
            allrecipesID,
            title,
            link,
            image,
            calories,
            prepTime,
            ingre,
            dir
        }

        recipes.push(recipe);
        console.log("Total Num of Recipes: " + recipes.length);
        
        var newrecipe  = {recipeID:recipe.allrecipesID, title:recipe.title, link:recipe.link, image:recipe.image, calories:recipe.calories, prepTime:recipe.prepTime, ingredients:recipe.ingre, directions:recipe.dir };
        // console.log("INSERT INTO recipes (recipeID, title, link, image, calories, prepTime, ingredients, directions) VALUES ?,?,?,?,?,?,?,?", (recipe.allrecipesID,recipe.title,recipe.link,recipe.image,recipe.calories, recipe.prepTime, recipe.ingre, recipe.dir))
        connection.query("INSERT INTO recipes SET ?", newrecipe, (err,rows) => {
          if(err) 
          {
            console.log("Error in SQL");
            console.log('\n')
          }
          else 
          {
            console.log('Recipe:\n');
            console.log(rows);
          }
        
        });
      
        //return recipes;
    });
}

//////////////////////////////////////////////////////////////////////

  module.exports = 
  {
    searchRecipes,
    getRecipe
  };

//////////////////////////////////////////////////////////////////////