import i18next from 'i18next';
import validator from '../validator.js';
import axios from 'axios';
import renderForm from './view/view.js';

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


  const elementsFeedAndPosts = {
    form: document.querySelector('form'),
    inputEl: document.querySelector('#url-input'),
    buttonAdd: document.querySelector('button[type="submit"]'),
    feedbackEl: document.querySelector('.feedback'),
    feedsEl: document.querySelector('.feeds'),
    postsEl: document.querySelector('.posts'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
    modalFooter: document.querySelector('.modal-footer'),
  };

  const watchedState = renderForm(state, elementsFeedAndPosts, i18nextInstance);

  renderForm.addEventListener('submit', (e) => {
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
