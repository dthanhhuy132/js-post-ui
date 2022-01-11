export function setTextContent(parent, selector, text) {
  if (!parent) return;

  const element = parent.querySelector(selector);
  if (element) element.textContent = text;
}

export function truncate(maxLength, text) {
  return text.length <= 100 ? text : `${text.slice(0, maxLength - 1)}...`;
}
