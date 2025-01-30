function renderSucces(elements, i18nextInstance) {
  const { input, feedback, form } = elements;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-warning');
  feedback.classList.add('text-success');
  feedback.textContent = i18nextInstance.t('form.succesMessage');
  form.reset();
  input.focus();
}

export default function renderState(elements, i18nextInstance, value) {
  switch (value) {
    case 'sending':
      renderSucces(elements, i18nextInstance);
      break;
    default:
      break;
  }
}
