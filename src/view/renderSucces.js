export default function renderSucces(elements, i18nextInstance) {
// submit.disabled = false;
  const { input, feedback, form } = elements;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.remove('text-warning');
  feedback.classList.add('text-success');
  feedback.textContent = i18nextInstance.t('form.succesMessage');
  form.reset();
  input.focus();
}
