export function setTextContent(parent, selector, text) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function truncate(maxLength, text) {
  return text.length <= 100 ? text : `${text.slice(0, maxLength - 1)}...`;
}

export function setFormValue(parent, selector, value) {
  if (!parent) return;
  const element = parent.querySelector(selector);
  element.value = value;
}

export function setBackgroundImg(parent, selector, imgUrl) {
  let element = parent.getElementById(selector);
  if (element) element.style.backgroundImage = `url(${imgUrl})`;
}

export function randomNumber(n) {
  const number = Math.random() * n;
  return Math.round(number);
}
