const API_URL = 'https://restcountries.com/v3.1';

const searchParams = new URLSearchParams({
  fields: ['name', 'capital', 'population', 'flags', 'languages'],
});

export const fetchCountries = name => {
  return fetch(`${API_URL}/name/${name}?${searchParams}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
  // .catch(error => {
  //   console.error(error.message);
  // });
};
