import renderErrors from './renderErrors.js';
import renderState from './renderState.js';

const renderFeeds = (state, elements, i18nextInstance) => {
  const { feeds } = elements;
  feeds.textContent = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');
  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18nextInstance.t('feeds.title');

  cardBody.append(h2);
  card.append(cardBody);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  state.feeds.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.feedTitle;

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.feedDescription;

    cardBody.append(ul);
    li.append(h3, p);
    ul.append(li);
  });

  feeds.append(card);
};

const renderPosts = (state, elements, i18nextInstance) => {
  const { posts } = elements;
  posts.textContent = '';

  const card = document.createElement('div');
  card.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.textContent = i18nextInstance.t('posts.title');

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  cardBody.append(h2, ul);
  card.append(cardBody);

  state.posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');
    const a = document.createElement('a');
    a.classList.add('fw-bold');
    a.setAttribute('data-id', post.postId);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.href = post.link;
    a.textContent = post.title;

    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('btn', 'btn-sm', 'btn-outline-primary');
    button.setAttribute('data-id', post.postId);
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.textContent = i18nextInstance.t('posts.buttonText');

    li.append(a, button);
    ul.append(li);
  });

  posts.append(card);
};
const renderPostPreview = (elements, posts) => {

  posts.forEach((post) => {
    const { title, description, link, postId } = post;
    elements.modalTitle.textContent = title;
    elements.modalDescription.textContent = description;
    elements.modalLink.setAttribute('href', link);

    const postLinkElement = document.querySelector(`[data-id="${postId}"]`);
    postLinkElement.classList.remove('fw-bold');
    postLinkElement.classList.add('fw-normal', 'text-muted');
  });
};


const renderForm = (state, elements, i18nextInstance) => (path, value) => {
  switch (path) {
    case 'formState':
      renderState(elements, i18nextInstance, value);
      break;
    case 'submitForm.error':
      renderErrors(state, elements, i18nextInstance, value);
      break;
    case 'feeds':
      renderFeeds(state, elements, i18nextInstance);
      break;
    case 'posts':
      renderPosts(state, elements, i18nextInstance);
      break;
    case 'clickedPost':
      renderPostPreview(elements, value);
      break;
    // case 'activePost':
    default:
      // throw new Error('Unknown path');
      break;
  }
};

export default renderForm;
