import postApi from './api/postApi';
import { setTextContent, truncate } from './ultils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

function creatPostElement(post) {
  if (!post) return;

  const postTemplate = document.querySelector('#postItemTemplate');

  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  // update title, thumbnail, description, author and timeSpan

  // const titleElement = liElement.querySelector('[data-id="title"]');
  // if (titleElement) titleElement.textContent = post.title;

  // const authorElement = liElement.querySelector('[data-id="author"]');
  // if (authorElement) authorElement.textContent = post.author;

  // const descriptionElement = liElement.querySelector('[data-id="description"]');
  // if (descriptionElement) authorElement.textContent = post.description;

  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="author"]', post.author);
  setTextContent(liElement, '[data-id="description"]', truncate(100, post.description));

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) thumbnailElement.src = post.imageUrl;

  // attach event
  const timeSpan = dayjs(post.updatedAt).fromNow();
  setTextContent(liElement, '[data-id="timeSpan"]', `-  ${timeSpan}`);

  return liElement;
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return;
  const ulElement = document.querySelector('#postList');
  if (!ulElement) return;

  postList.forEach((post) => {
    const liElement = creatPostElement(post);
    ulElement.appendChild(liElement);
  });
}

// ------------------------------------------------------------------------ PAGINATION

function hadnleFilterChange() {
  const url = new URL(window.location);
  
}

function hadnlePreClick(e) {
  e.preventDefault();
}

function handleNextClick(e) {
  e.preventDefault();
}

function initPagination() {
  const ulPagination = document.querySelector('#pagination');
  if (!ulPagination) return;
  const preLink = ulPagination.firstElementChild?.firstElementChild;
  const nextLink = ulPagination.lastElementChild?.lastElementChild;

  preLink.addEventListener('click', hadnlePreClick);
  nextLink.addEventListener('click', handleNextClick);
}

(async () => {
  try {
    initPagination();

    const queryParams = {
      _page: 1,
      _limit: 6,
    };

    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);

    // attack token to request if exist
  } catch (error) {}
})();
