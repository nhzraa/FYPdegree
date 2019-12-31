const connection = require('./recipeDB');
const mysql = require('mysql');

const fetch = require ('node-fetch');
const cheerio = require('cheerio');

const EpiSearchURL = 'https://www.epicurious.com/search?content=recipe&page=';
const AllEpiURL = 'https://www.epicurious.com';

const recipes = [];

//////////////////////////////////////////////////////////////////////
//untuk loop pages scraping//

async function SearchEpiRecipes(p) {
  var p;
  
  for (p=520; p<580; p++) 
  {
    console.log("Scraping page :"+p);
    await SearchEpiRecipesFunc(recipes,p);
  }
}

//////////////////////////////////////////////////////////////////////

function SearchEpiRecipesFunc(recipes,p) {
  return fetch (`${EpiSearchURL}${p}`)
    .then(response => response.text())
    .then(body => { 

   
    const $ = cheerio.load(body);

    console.log("length: " +$('.recipe-content-card').length);

    $('.recipe-content-card').each(function(i, element) {
      const $element = $(element); 
      const $title = $element.find('header h4 a');
      const $link = $element.find('header h4 a');

      const epiID = $link.attr('href');

      getEpiRecipe(epiID);
    });
  }); 
}

//////////////////////////////////////////////////////////////////////
  function getEpiRecipe (epiID)
  {
    return fetch (`${AllEpiURL}${epiID}`)
      .then(response => response.text())
      .then(body => {
        
        const ingredients = [];
        const directions = [];
        const calories = [];

        const $ = cheerio.load(body);
        
        const $title = $('.recipe-title-wrapper div h1');
        const title = $title.text();

        link = (`${AllEpiURL}${epiID}`);
        
        const $image = $('.recipe-image div div picture img');
        const image = $image.attr('srcset');


        // console.log(epiID);
        // console.log(title);
        // console.log(link);
        // console.log(image);

        // const $calories = $('.additional-info-panels div div ul li[itemprop="calories"]');
        // //const calories = $calories.attr('calories');
        // const cal = $calories.text();
        // console.log(cal);

        // $('li[itemprop="calories"]').each(function(i, element) {

        //   const calories = $(element).text();
        //   console.log(calories);
        // });
        // const cal = calories;
        // console.log(cal);

        // const $prepTime = $('.ready-in-time');
        // const prepTime = $prepTime.text();

        $('li[itemprop="ingredients"]').each(function(i, element) {

          const ingredient = $(element).text();
          ingredients.push(ingredient);
        });
        const ingre = ingredients.join(','); 
        //console.log(ingre);

        $('li[class="preparation-step"]').each(function(i, element) {

          const direction = $(element).text();
          directions.push(direction);
        });
        const dir = directions.join(',');
        //console.log(dir);

        const recipe =
        {
            epiID,
            title,
            link,
            image,
            // calories,
            // prepTime,
            ingre,
            dir
        }

        recipes.push(recipe);
        //console.log('\n');
        console.log("Total Num of Recipes: " + recipes.length);
        
        var newrecipe2  = {recipeID:recipe.epiID, title:recipe.title, link:recipe.link, image:recipe.image, ingredients:recipe.ingre, directions:recipe.dir };
        //console.log("INSERT INTO recipes (recipeID, title, link, image, ingredients, directions) VALUES ?,?,?,?,?,?", (recipe.allrecipesID,recipe.title,recipe.link,recipe.image,recipe.calories, recipe.prepTime, recipe.ingre, recipe.dir))
        connection.query("INSERT INTO recipes SET ?", newrecipe2, (err,rows) => {
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
  module.exports = {
    SearchEpiRecipes,
    getEpiRecipe
  };

