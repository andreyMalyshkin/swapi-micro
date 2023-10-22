const fetch = require("node-fetch");

const URL = "https://swapi.dev/api/people/?search=";
const searchQueries = process.argv.slice(2);

if (searchQueries.length > 0) {
  const fetchData = async () => {
    const results = await Promise.all(
      searchQueries.map(async (query) => {
        try {
          const response = await fetch(`${URL}${query}`);
          if (response.ok) {
            const data = await response.json();
            console.log(`Результат поиска для "${query}":`);
            console.log(data);

            if (data.count === 0) {
              console.warn(`No results found for '${query}'`);
            }
            return data;
          } else {
            console.error(`Произошла ошибка при выполнении запроса для "${query}".`);
            return null;
          }
        } catch (error) {
          console.error(`Произошла ошибка при выполнении запроса для "${query}":`, error);
          return null;
        }
      })
    );
    const characters = results
      .filter((data) => data && data.results && data.results.length > 0)
      .map((data) => data.results[0]);

    console.log(`Total results: ${results.reduce((total, data) => total + data.count, 0)}.`);
    console.log(`All: ${characters.map((character) => character.name).join(", ")}.`);
    console.log(`Min height: ${getCharacterWithMinHeight(characters)}.`);
    console.log(`Max height: ${getCharacterWithMaxHeight(characters)}.`);
  };

  fetchData();
} else {
  console.log("Введите корректный запрос");
}

function getCharacterWithMinHeight(characters) {
  if (characters.length === 0) {
    return "No characters found.";
  }

  const minCharacter = characters.reduce(
    (min, character) => (parseInt(character.height) < parseInt(min.height) ? character : min),
    characters[0]
  );
  return `${minCharacter.name}, ${minCharacter.height} cm`;
}

function getCharacterWithMaxHeight(characters) {
  if (characters.length === 0) {
    return "No characters found.";
  }

  const maxCharacter = characters.reduce(
    (max, character) => (parseInt(character.height) > parseInt(max.height) ? character : max),
    characters[0]
  );
  return `${maxCharacter.name}, ${maxCharacter.height} cm`;
}
