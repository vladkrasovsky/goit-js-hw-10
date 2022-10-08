import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { refs } from './js/refs';
import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const MAX_COUNTRIES_QTY = 10;

const onSearch = ({ target }) => {
  const searchQuery = target.value.trim();

  if (!searchQuery) {
    target.value = searchQuery;
    return clearAllMarkup();
  }

  fetchCountries(searchQuery).then(onSuccess).catch(onFailure);
};

const onClick = ({ target }) => {
  if (target.nodeName !== 'UL') {
    const searchQuery = target.dataset.name;

    clearAllMarkup();
    refs.searchBox.value = searchQuery;
    fetchCountries(searchQuery, true).then(onSuccess).catch(onFailure);
  }
};

refs.searchBox.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));
refs.countryList.addEventListener('click', onClick);

function onSuccess(data) {
  const countriesQty = data.length;

  if (countriesQty > MAX_COUNTRIES_QTY) {
    clearAllMarkup();
    return Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  }

  if (countriesQty > 1) {
    refs.countryInfo.innerHTML = '';
    return renderCountryList(data);
  }

  refs.countryList.innerHTML = '';
  renderCountryInfo(data[0]);
}

function onFailure() {
  Notify.failure('Oops, there is no country with that name');
}

function clearAllMarkup() {
  refs.countryInfo.innerHTML = '';
  refs.countryList.innerHTML = '';
}

function renderCountryList(countries) {
  if (!countries) return;

  const markup = countries.reduce((acc, { name, flags }) => {
    return (
      acc +
      `<li class="list-group-item list-group-item-action" data-name="${name.common}">
        <img src="${flags.svg}" width="30">${name.common}
      </li>`
    );
  }, '');

  refs.countryList.innerHTML = markup;
}

function renderCountryInfo(country) {
  if (!country) return;

  const { name, capital, flags, population, languages } = country;
  const langs = Object.values(languages).join(', ');

  const markup = `
    <div class="card">
      <img src="${flags.svg}" class="card-img-top" alt="${name.common}">
      <div class="card-body">
        <h4 class="card-title mb-0">${name.common}</h4>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item"><b>Capital:</b> ${capital}</li>
        <li class="list-group-item"><b>Population:</b> ${population}</li>
        <li class="list-group-item"><b>Languages:</b> ${langs}</li>
      </ul>
    </div>
  `;

  refs.countryInfo.innerHTML = markup;
}
