import renderErrors from './renderErrors.js';
import renderState from './renderState.js';

const renderForm = (state, elements, i18nextInstance) => (path, value) => {
  switch (path) {
    case 'formState':
      renderState(elements, i18nextInstance, value);
      break;
    case 'submitForm.error':
      renderErrors(state, elements, i18nextInstance, value);
      break;

    default:
      // throw new Error('Unknown path');
      break;
  }
};

export default renderForm;
