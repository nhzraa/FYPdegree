const fetch = require ('node-fetch');
const cheerio = require('cheerio');

const ARsearchUrl = 'https://www.allrecipes.com/search/results/?wt=';
const allrecipesUrl = 'https://www.allrecipes.com/recipe/';

function searchRecipesFunc(recipes,searchTerm,p) {
  return fetch (`${ARsearchUrl}${searchTerm}&page=${p}`)
    .then(response => response.text())
    .then(body => { 

   
    const $ = cheerio.load(body);


    $('.fixed-recipe-card').each(function(i, element) {
      const $element = $(element); 
      const $title = $element.find('div h3 a span');
      const $link = $element.find('div h3 a');

      const allrecipesID = $link.attr('href').match(/recipe\/(.*)\//)[1];


      const recipe = {
        title: $title.text(),
        link: $link.attr('href'),
        allrecipesID
      };

      recipes.push(recipe);
      
    });
  }); 
}

async function searchRecipes (searchTerm) {
  var p;
  const recipes = [];

  for (p=1; p<10; p++) 
  {
    console.log("Scrapping page :"+p);
    await searchRecipesFunc(recipes,searchTerm,p);
  }

  return recipes;
  
}

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

        const $calories = $('.calorie-count');
        const calories = $calories.text();

        const $prepTime = $('.ready-in-time');
        const prepTime = $prepTime.text();

        $('ul[ng-hide="reloaded"]').each(function(i, element) {

          const ingredient = $(element).text();
          ingredients.push(ingredient);
        });

        $('span[class="recipe-directions__list--item"]').each(function(i, element) {

          const direction = $(element).text();
          directions.push(direction);
        });

        return {
          title, 
          calories,
          prepTime,
          ingredients,
          directions
        }
    });
  }

  module.exports = {
    searchRecipes,
    getRecipe
  };