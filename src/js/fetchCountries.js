const API_URL = 'https://restcountries.com/v3.1';

export const fetchCountries = (name, fullText = false) => {
  const searchParams = new URLSearchParams({
    fields: ['name', 'capital', 'population', 'flags', 'languages'],
    fullText,
  });

  return fetch(`${API_URL}/name/${name}?${searchParams}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};
