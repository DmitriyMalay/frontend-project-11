import * as yup from 'yup';
import i18next from 'i18next';
import onChange from 'on-change';
import axios from 'axios';
import { uniqueId } from 'lodash';
import resources from './locales/index.js';
import renderForm from './view/view.js';
import parser from './view/parserResponse.js';

const validation = (url, readPosts, i18nextInstance) => {
  const schema = yup.string()
    .trim()
    .required(i18nextInstance.t('form.errors.notEmpty'))
    .url(i18nextInstance.t('form.errors.invalidLink'))
    .notOneOf(readPosts, i18nextInstance.t('form.errors.addedLink'))
    .validate(url, { abortEarly: false });
  return schema;
};

const getResponse = (url) => {
  const urlProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlProxy.searchParams.set('disableCache', 'true');
  urlProxy.searchParams.set('url', url);
  const addProxy = urlProxy.toString();
  return axios.get(addProxy);
};

const createFeedElement = (parserResult, value) => {
  const feedTitle = parserResult.titleChannel;
  const feedDescription = parserResult.descriptionChannel;
  const feedLink = value;
  const feedId = uniqueId();

  return {
    feedTitle,
    feedDescription,
    feedLink,
    feedId,
  };
};

const createPostElement = (posts) => posts.map(({ title, description, link }) => {
  const postId = uniqueId();
  return {
    title,
    description,
    link,
    postId,
  };
});

const updatePosts = (state, timeout = 5000) => {
  const { posts, feeds } = state;

  const existingLinks = new Set(posts.map((post) => post.link));

  const feedPromises = feeds.map((feed) => getResponse(feed.feedLink)
    .then(parser)
    .then((parseData) => createPostElement(parseData.posts))
    .catch((error) => {
      console.error(error.message);
    }));

  Promise.all(feedPromises)
    .then((newPosts) => {
      newPosts.flat().forEach((newPost) => {
        if (!existingLinks.has(newPost.link)) {
          state.posts.unshift(newPost);
        }
      });
    })
    .catch((error) => {
      console.error(error.message);
    })
    .finally(() => {
      setTimeout(() => updatePosts(state, timeout), timeout);
    });
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
      .then(() => getResponse(inputValue))
      .then((response) => {
        // console.log(response.data.contents)
        const parserResult = parser(response);
        // console.log(parserResult);
        const feed = createFeedElement(parserResult.feed, inputValue);
        // console.log(feed);
        const posts = createPostElement(parserResult.posts);
        console.log(posts);
        watchedState.feeds.unshift(feed);
        watchedState.posts = posts.concat(watchedState.posts);
        // console.log(state);
      })
      .then(() => {
        watchedState.submitForm.error = '';
        watchedState.formState = 'sending';
        watchedState.readPosts.push(inputValue);
        updatePosts(watchedState);
      })
      .catch((error) => {
        watchedState.formState = 'invalid';
        console.log(error.message);
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
    const formData = new FormData(event.target);
    const data = formData.get('url');
    handleFormSubmit(data);
  });
}
