export default function renderErrors(state, elements, i18nextInstance, error) {
  const { feedback, input } = elements;
  if (error === '') {
    return;
  }

  feedback.classList.add('text-danger');
  input.classList.add('is-invalid');
  console.log(state);
  feedback.textContent = i18nextInstance.t(`${state.submitForm.error}`);
}
