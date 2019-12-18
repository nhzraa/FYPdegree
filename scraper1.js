
const fetch = require ('node-fetch');
const cheerio = require('cheerio');

//1st Website - AllRecipes
//const ARsearchUrl = 'https://www.allrecipes.com/search/results/?wt=';
//const allrecipesUrl = 'https://www.allrecipes.com/recipe/';
 
//2nd Website - Epicurious
//const EPsearchUrl = 'https://www.epicurious.com/search/';
//const allEPurl = 'https://www.epicurious.com/recipes/food/views/';

//3rd Website - Food52
const foodSearchUrl = 'https://food52.com/recipes/search?tag=test-kitchen-approved&page=';
const allfoodURL = 'https://food52.com/recipes/';

//function untuk search recipe and scrape data from multiple pages
//localhost:3000/search/::search
function searchFoodRecipesFunc(recipes,p) {
  return fetch (`${foodSearchUrl}${p}`)
    .then(response => response.text())
    .then(body => 

    { 
      const $ = cheerio.load(body);

      $('div[class="card collectable-tile js-collectable-tile js-quick-basket"]').each(function(i, element) 
      {
        const $element = $(element); 
        const $title = $element.find('div h3 a');
        const $link = $element.find('div h3 a');
        const foodID = $link.attr('href').match(/recipes\/.*/)[0];
        
        const recipe = 
        {
          food_title: $title.text(),
          food_link: $link.attr('href'),
          foodID
        };

        recipes.push(recipe);
        console.log(recipe);
        console.log("");
      });
    }); //habis return fetch 


}

async function searchFoodRecipes (p) 
{
  var p;
  const recipes = [];

  for (p=1; p<3; p++) 
  {
    console.log("Scraping page :"+p);
    await searchFoodRecipesFunc(recipes,p);
  }

  return (recipes);
  
}

  function getFoodRecipe (foodID)
  {
    return fetch (`${allfoodURL}${foodID}`)
      .then(response => response.text())
      .then(body => {
        
        const ingredients = [];
        const directions = [];

        console.log(`${allfoodURL}${foodID}`);

        const $ = cheerio.load(body);
        
        const $title = $('.recipe div header h1');
        const title = $title.text();
        console.log(title);

        //const $calories = $('span[itemprop="calories"]');
        //const calories = $calories.text();
        //console.log(calories);

        //const $prepTime = $('.ready-in-time');
        //const prepTime = $prepTime.text();

        $('.recipe__list ul li').each(function(i, element) {

          const ingredient = $(element).text();
          ingredients.push(ingredient);
        }); 
        console.log(ingredients);

        $('li[class="recipe__list-step"]').each(function(i, element) {

          const direction = $(element).text();
          directions.push(direction);
        });

        console.log(directions);

        return {
          title, 
          //calories,
          //prepTime,
          ingredients,
          directions
        }
    }); //habis return fetch
  }

  module.exports = {
    searchFoodRecipes,
    getFoodRecipe
  };