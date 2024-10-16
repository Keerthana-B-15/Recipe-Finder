const modal = document.getElementById("ingredients-modal");
const btn = document.getElementById("add-ingredients-btn");
const span = document.getElementsByClassName("close")[0];
const searchButton = document.getElementById("search-recipes-btn");
const recipeList = document.getElementById("recipe-list");
const ingredientsSelect = document.getElementById("ingredients-select");

// Open the modal
btn.onclick = function() {
    modal.style.display = "block";
    fetchIngredients(); // Fetch ingredients when the modal opens
}

// Close the modal
span.onclick = function() {
    modal.style.display = "none";
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// Search recipes when the button is clicked
searchButton.onclick = function() {
    const selectedOptions = Array.from(ingredientsSelect.selectedOptions);
    const ingredients = selectedOptions.map(option => option.value).join(',');

    if (ingredients) {
        fetchRecipes(ingredients);
        modal.style.display = "none";
    }
}

// Function to fetch ingredients from TheMealDB API
async function fetchIngredients() {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`); // TheMealDB ingredient list
        const data = await response.json();
        populateIngredients(data.meals); // Populate the dropdown with fetched ingredients
    } catch (error) {
        console.error("Error fetching ingredients:", error);
    }
}

// Function to populate the dropdown with ingredients
function populateIngredients(ingredients) {
    ingredientsSelect.innerHTML = ""; // Clear existing options
    ingredients.forEach(ingredient => {
        const option = document.createElement("option");
        option.value = ingredient.strIngredient; // Use the ingredient name as the value
        option.textContent = ingredient.strIngredient; // Display the ingredient name
        ingredientsSelect.appendChild(option);
    });
}

// Function to fetch recipes from TheMealDB API
async function fetchRecipes(ingredients) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`);
        const data = await response.json();
        displayRecipes(data.meals); // Display recipes
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

// Function to display recipes
function displayRecipes(recipes) {
    recipeList.innerHTML = "";
    if (recipes && recipes.length > 0) {
        recipes.forEach(recipe => {
            const recipeDiv = document.createElement("div");
            recipeDiv.innerHTML = `
                <h3>${recipe.strMeal}</h3>
                <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" style="width: 100px; height: auto;">
            `;
            recipeList.appendChild(recipeDiv);
        });
    } else {
        recipeList.innerHTML = "<p>No recipes found.</p>";
    }
}
