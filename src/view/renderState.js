import renderSucces from './renderSucces.js';

export default function renderState(elements, i18nextInstance, value) {
  switch (value) {
    case 'sending':
      renderSucces(elements, i18nextInstance);
      break;
    default:
      break;
      // throw new Error('Unknown form state');
  }
}
