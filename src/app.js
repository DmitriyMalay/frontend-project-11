import * as yup from 'yup';
import i18next from 'i18next';
import onChange from 'on-change';
import resources from './locales/index.js';
import renderForm from './view/view.js';

const validation = (url, readPosts, i18nextInstance) => {
  const schema = yup.string()
    .trim()
    .required(i18nextInstance.t('form.errors.notEmpty'))
    .url(i18nextInstance.t('form.errors.invalidLink'))
    .notOneOf(readPosts, i18nextInstance.t('form.errors.addedLink'))
  return schema.validate(url, { abortEarly: false });
};

export default function app() {

  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modalTitle: document.querySelector('.modal-title'),
    modalDescription: document.querySelector('.modal-body'),
    modalLink: document.querySelector('.full-article'),
    buttonSend: document.querySelector('button[type="submit"]'),
  };

  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: false,
    resources,
  })
    .then(() => {
      yup.setLocale({
        string: {
          url: () => ({ key: 'invalidLink' }),
          required: () => ({ key: 'notEmpty' }),
        },
        mixed: {
          notOneOf: () => ({ key: 'addedLink' }),
        },
      });
    });

  const state = {
    formState: 'filling',
    feeds: [],
    posts: [],
    submitForm: {
      error: '',
      success: '',
    },
    readPosts: [],
  };

  const watchedState = onChange(state, renderForm(state, elements, i18nextInstance));

  const handleFormSubmit = (inputValue) => {
    const formSchema = validation(inputValue, watchedState.readPosts, i18nextInstance);
    formSchema
      .then(() => {
        watchedState.submitForm.error = '';
        watchedState.formState = 'sending';
        console.log(state);
        watchedState.readPosts.push(inputValue);
      })
      .catch((error) => {
        watchedState.formState = 'invalid';
        if (error.message === 'Network Error') {
          watchedState.submitForm.error = i18nextInstance.t('form.errors.networkError');
        } else if (error.message === 'notRss') {
          watchedState.submitForm.error = i18nextInstance.t('form.errors.notRss');
        } else {
          watchedState.submitForm.error = error.message;
        }
      });
  };

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();
    // const addedLinks = watchedState.feeds.map((feed) => feed.link);
    const formData = new FormData(event.target);
    const data = formData.get('url');
    handleFormSubmit(data);
  });
}