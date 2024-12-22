export default function renderError(error, elements, i18nextInstance) {
  elements.feedbackEl.textContent = '';
  if (error) {
    elements.buttonAdd.disabled = false;
    elements.feedbackEl.classList.remove('text-success');
    elements.feedbackEl.classList.add('text-danger');
    elements.feedbackEl.textContent = i18nextInstance.t(error);
  }
}
