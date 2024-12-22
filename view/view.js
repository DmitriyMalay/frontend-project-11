import onChange from 'on-change';
import renderErrors from './renderErrors.js';

const renderForm = (state, elements, i18nextInstance) => onChange(state, (path, value) => {
  switch (path) {
    case 'submitForm.error':
      renderErrors(value, elements, i18nextInstance);
      break;
    default:
      throw new Error('Unknown path');
  }
});

export default renderForm;
