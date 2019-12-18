const fetch = require ('node-fetch');
const cheerio = require('cheerio');
const mysql  = require('mysql');

const config = {
  host    : 'localhost',
  user    : 'root',
  password: 'password5197_',
  database: 'recipeapp'
};

const connection = mysql.createConnection(config);

const EpiSearchURL = 'https://www.epicurious.com/search?content=recipe&page=';
const AllEpiURL = 'https://www.epicurious.com/recipes/food/views/';

function SearchEpiRecipesFunc(recipes,p) {
  return fetch (`${EpiSearchURL}${p}`)
    .then(response => response.text())
    .then(body => { 

   
    const $ = cheerio.load(body);


    $('.recipe-content-card').each(function(i, element) {
      const $element = $(element); 
      const $title = $element.find('header h4 a');
      const $link = $element.find('header h4 a');

      const epiID = $link.attr('href').match(/views\/.*/)[0];

        const recipe = {
        title: $title.text(),
        link: $link.attr('href'),
        epiID
      };

      console.log(recipe);
      recipes.push(recipe);
      
    });
  }); 

    let sql = `INSERT INTO recipeapp(recipeID,recipeTitle,recipeLink)
           VALUES(${epiID},${title},${link})`;
           console.log(sql);
}

async function SearchEpiRecipes(p) {
  var p;
  const recipes = [];

  for (p=1; p<2; p++) 
  {
    console.log("Scraping page :"+p);
    await SearchEpiRecipesFunc(recipes,p);
  }

  return recipes;
  
}


  function getEpiRecipe (epiID)
  {
    return fetch (`${AllEpiURL}${epiID}`)
      .then(response => response.text())
      .then(body => {
        
        const ingredients = [];
        const directions = [];

        const $ = cheerio.load(body);
        
        console.log(`${AllEpiURL}${epiID}`);

        const $image = $('.recipe-image div div picture img');
        const image = $image.attr('srcset');
        console.log(image);

        const $title = $('.title-source h1');
        const title = $title.text();
        console.log(title);

        //const $calories = $('.calorie-count');
        //const calories = $calories.text();

        //const $prepTime = $('.ready-in-time');
        //const prepTime = $prepTime.text();

        $('li[itemprop="ingredients"]').each(function(i, element) {

          const ingredient = $(element).text();
          ingredients.push(ingredient);
        });
        console.log(ingredients);

        $('li[class="preparation-step"]').each(function(i, element) {

          const direction = $(element).text();
          directions.push(direction);
        });
        console.log(directions);

        return {
          image,
          title, 
          //calories,
          //prepTime,
          ingredients,
          directions
        }

        /*let sql = `UPDATE recipeapp
                  SET (recipeIngre,recipeDir,recipeImgLink)
                  VALUES(${ingredients},${directions},${image})
                  WHERE recipeTitle = ${title}`;*/
    });
  }

  

  module.exports = {
    SearchEpiRecipes,
    getEpiRecipe
  };

