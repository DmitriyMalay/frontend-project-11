import * as yup from 'yup';

export default function validator(newUrl, urls) {
  const schema = yup
    .string()
    .trim()
    .required()
    .url()
    .notOneOf(urls);
  return schema
    .validate(newUrl, { abortEarly: true });
};
