import debounce from 'lodash.debounce';

export function initSearch({ elementId, defaultParams, onChange }) {
  const searchEl = document.getElementById(elementId);
  if (defaultParams.get('title_like')) searchEl.value = defaultParams.get('title_like');

  const debounceSearch = debounce((e) => onChange?.(e.target.value), 500);
  searchEl.addEventListener('input', debounceSearch);
}
