import i18next from 'i18next';
import axios from 'axios';
import validator from './utils/validator.js';

export default function app() {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });

  const state = {
    feeds: [],
    posts: [],
    submitForm: {
      stateForm: 'filling',
      error: '',
    },
    readPosts: [],
  };

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.submitForm.stateForm = 'filling';
    const formData = new FormData(e.target);
    const url = formData.get('url');
    const urlsList = watchedState.feeds.map((feed) => feed.url);
    validator(url, urlsList, i18nextInstance)
      .then((validUrl) => {
        watchedState.submitForm.error = '';
        watchedState.submitForm.stateForm = 'processing';
        return axios.get(getProxy(validUrl));
      })
      .catch((error) => {
        watchedState.submitForm.stateForm = 'invalid';
        const errorMessageKey = getMessageError(error);
        watchedState.submitForm.error = errorMessageKey;
      });
  });
}
