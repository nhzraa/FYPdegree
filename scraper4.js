const db = require('./recipeDB');
const mysql = require('mysql');

const fetch = require ('node-fetch');
const cheerio = require('cheerio');

const ARsearchUrl = 'https://www.allrecipes.com/search/?page=';
const allrecipesUrl = 'https://www.allrecipes.com/recipe/';

//////////////////////////////////////////////////////////////////////
//untuk connect db//

const connection = mysql.createConnection
({
    host: 'localhost',
    user: 'root',
    password: 'password5197_',
    database: 'recipe_app'
});

//////////////////////////////////////////////////////////////////////
//untuk loop pages scraping//

async function searchRecipes (p) {
  var p;
  const recipes = [];

  for (p=1; p<2; p++) 
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
        
        const recipes = [];
        const ingredients = [];
        const directions = [];

        const $ = cheerio.load(body);

        const $title = $('.recipe-summary h1');
        const title = $title.text();
        
        const link = (`${allrecipesUrl}${allrecipesID}`)
        
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

        console.log('\n');
        
        $('span[class="recipe-directions__list--item"]').each(function(i, element) {

          const direction = $(element).text();
          directions.push(direction);
        });

        const dir = directions.join(',');

        console.log('\n');

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
        console.log(recipes);
        console.log("Total Num of Recipes: " + recipes.length);

        var i;
        const str = [];

        for (i=0; i<recipes.length; i++)
        {
            const str = "('{$allrecipesID[i]}','{$title[i]}','{$link[i]}','{$image[i]}','{$calories[i]}','{$prepTime[i]}','{$ingre[i]}','{$dir[i]}')";  
        }

        const r = str.join(',');

        connection.query('INSERT INTO recipes (recipeID, title, link, image, calories, prepTime, ingredients, directions) VALUES $r', (err,rows) => {
            if(err) 
                {console.log("Error");}
            else 
                {
                    console.log('Recipe:\n');
                    console.log(rows);
                }
            
        });

        return recipes;
    });
};

//////////////////////////////////////////////////////////////////////

  module.exports = 
  {
    searchRecipes,
    getRecipe
  };

//////////////////////////////////////////////////////////////////////