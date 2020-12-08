/* eslint-disable */

let required = propertyType => {
  return v => (v && v.length > 0) || `You must input a ${propertyType}`;
};
let minLength = (propertyType, minLength) => {
  return v =>
    (v && v.length >= minLength) ||
    `${propertyType} must be at least ${minLength} characters`;
};
let maxLength = (propertyType, maxLength) => {
  return v =>
    (v && v.length <= maxLength) ||
    `${propertyType} must be less than ${maxLength} characters`;
};

let emailFormat = () => {
  let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,24})+$/;
  return v => (v && regex.test(v)) || "Must be a valid email";
};
let noSpaces = () => {
  let regex = /^\S*$/u;
  return v => (v && regex.test(v)) || "Cannot have spaces";
};

let positiveNumber = () => {
  let regex = /^[0-9]+([,.][0-9]+)?$/;
  return v => (v && regex.test(v)) || "Must be a positive number";
};
let anyNumber = () => {
  let regex = /^-?([0]{1}\.{1}[0-9]+|[1-9]{1}[0-9]*\.{1}[0-9]+|[0-9]+|0)$/;
  return v => (v && regex.test(v)) || "Must be a positive number";
};

let uniqueValue = (inputList) => {
  return v =>
    (inputList.indexOf(v)===-1) ||
    `Input is already taken`;
};
export default {
  required,
  minLength,
  maxLength,
  emailFormat,
  positiveNumber,
  anyNumber,
  noSpaces,
  uniqueValue
};
