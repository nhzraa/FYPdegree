const fetch = require ('node-fetch');
const cheerio = require('cheerio');

const ARsearchUrl = 'https://www.allrecipes.com/search/?page=';
const allrecipesUrl = 'https://www.allrecipes.com/recipe/';

function searchRecipesFunc(recipes,p) {
  return fetch (`${ARsearchUrl}${p}`)
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

      console.log(recipe);
      recipes.push(recipe);
      
    });
  }); 
}

async function searchRecipes (p) {
  var p;
  const recipes = [];

  for (p=1; p<3; p++) 
  {
    console.log("Scraping page :"+p);
    await searchRecipesFunc(recipes,p);
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

        console.log(`${allrecipesUrl}${allrecipesID}`);

        const $ = cheerio.load(body);
        
        const $image = $('.summary-background div section div div a img');
        const image = $image.attr('src');
        console.log(image);

        const $title = $('.recipe-summary h1');
        const title = $title.text();
        console.log(title);

        const $calories = $('.calorie-count');
        const calories = $calories.text();
        console.log(calories);

        const $prepTime = $('.ready-in-time');
        const prepTime = $prepTime.text();
        console.log(prepTime);

        $('ul[ng-hide="reloaded"]').each(function(i, element) {

          const ingredient = $(element).text();
          ingredients.push(ingredient);
        });
        console.log(ingredients);

        $('span[class="recipe-directions__list--item"]').each(function(i, element) {

          const direction = $(element).text();
          directions.push(direction);
        });
        console.log(directions);

        return {
          image,
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