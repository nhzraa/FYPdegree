const connection = require('./recipeDB');
const mysql = require('mysql');

const fetch = require ('node-fetch');
const cheerio = require('cheerio');

const ARsearchUrl = 'https://www.food.com/recipe?ref=nav&pn=';
const allrecipesUrl = 'https://www.food.com/recipe';

const recipes = [];

//////////////////////////////////////////////////////////////////////
//untuk loop pages scraping//

async function searchRecipes (p) {
  var p;
  
  for (p=1; p<2; p++) 
  {
    console.log("Scraping page :"+p);
    await searchRecipesFunc(recipes,p);
  }

  return recipes;
}

//////////////////////////////////////////////////////////////////////
//untuk scrape outer - search results based on page yg dah set//

function searchRecipesFunc(recipes,p) {
  return fetch (`${ARsearchUrl}${p}`)
    .then(response => response.text())
    .then(body => { 

   
    const $ = cheerio.load(body);

    console.log("length: " +$('.fd-tile').length);
    
    $('.fd-tile fd-recipe').each(function(i, element) {
      const $element = $(element); 
      
      const $title = $element.find('div[class="details"] h2 a');
      const title = $title.text();
      console.log(title);
      
      const $link = $element.find('div[class="details"] h2 a');
      const link = $link.attr('href');
      console.log(link);

      // const allrecipesID = $link.attr('href').match(/\/(.*)\//)[1];
      // console.log(allrecipesID);

      // getRecipe(allrecipesID);
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

        const $title = $('.recipe-layout__title div h1');
        const title = $title.text();
        console.log(title);
        
        const link = (`${allrecipesUrl}${allrecipesID}`);
        console.log(link);
        
        const $image = $('.recipe-hero__item div div img');
        const image = $image.attr('src');
        console.log(image);
        // const $calories = $('.calorie-count');
        // const calories = $calories.text();
        
        // const $prepTime = $('.ready-in-time');
        // const prepTime = $prepTime.text();
        
        $('li[class="recipe-ingredients__item"] div div span').each(function(i, element) {

          const ingredient = $(element).text();
          ingredients.push(ingredient);
        });

        const ingre = ingredients.join(','); 
        
        $('ul[class="recipe-directions__steps"]').each(function(i, element) {

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
            // calories,
            // prepTime,
            ingre,
            dir
        }

        recipes.push(recipe);
        console.log("Total Num of Recipes: " + recipes.length);
        
        // var newrecipe  = {recipeID:recipe.allrecipesID, title:recipe.title, link:recipe.link, image:recipe.image, ingredients:recipe.ingre, directions:recipe.dir };
        // // console.log("INSERT INTO recipes (recipeID, title, link, image, calories, prepTime, ingredients, directions) VALUES ?,?,?,?,?,?,?,?", (recipe.allrecipesID,recipe.title,recipe.link,recipe.image,recipe.calories, recipe.prepTime, recipe.ingre, recipe.dir))
        // connection.query("INSERT INTO recipes SET ?", newrecipe, (err,rows) => {
        //   if(err) 
        //   {
        //     console.log("Error in SQL");
        //     console.log('\n');
        //     console.error(err.message);
        //     //throw err;
        //   }
        //   else 
        //   {
        //     console.log('Recipe:\n');
        //     console.log(rows);
        //   }


        // });
      
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