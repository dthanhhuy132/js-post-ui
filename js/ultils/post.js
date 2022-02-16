import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncate } from './common';
dayjs.extend(relativeTime);

export function creatPostElement(post) {
  if (!post) return;

  const postTemplate = document.querySelector('#postItemTemplate');

  if (!postTemplate) return;

  const liElement = postTemplate.content.firstElementChild.cloneNode(true);
  if (!liElement) return;

  setTextContent(liElement, '[data-id="title"]', post.title);
  setTextContent(liElement, '[data-id="author"]', post.author);
  setTextContent(liElement, '[data-id="description"]', truncate(90, post.description));

  const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
  if (thumbnailElement) thumbnailElement.src = post.imageUrl;

  // attach event
  const timeSpan = dayjs(post.updatedAt).fromNow();
  setTextContent(liElement, '[data-id="timeSpan"]', `- ${timeSpan}`);

  const divPostItemEl = liElement.firstElementChild;
  divPostItemEl.addEventListener('click', (e) => {
    const postMenuItem = divPostItemEl.querySelector("[data-id = 'post-menu']");
    if (postMenuItem && postMenuItem.contains(e.target)) return;

    window.location.assign(`/post-detail.html?id=${post.id}`);
  });

  const editPostEl = divPostItemEl.querySelector('#editPostBtn');
  editPostEl.addEventListener('click', () => {
    window.location.assign(`/add-edit-post.html?id=${post.id}`);
  });

  const deleteBtns = liElement.querySelectorAll('[name="delete-button"]');
  if (deleteBtns) {
    deleteBtns.forEach((deleteBtn) =>
      deleteBtn.addEventListener('click', function () {
        let myModal = new bootstrap.Modal(document.getElementById('modal-confirm-delete-post'), {
          keyboard: false,
        });
        myModal.show();
        const postUrl = `<a href=/post-detail.html?id=${post.id} style="color: blue; text-decoration:none">${post.title}</a>`;

        myModal._element.querySelector(
          '.modal-body'
        ).innerHTML = `Are you sure to romove post: ${postUrl}`;
        const customEvent = new CustomEvent('post-delete', {
          bubbles: true,
          detail: { post, myModal },
        });
        deleteBtn.dispatchEvent(customEvent);
      })
    );
  }

  return liElement;
}

export function renderPostList(postList) {
  if (!Array.isArray(postList)) return;
  const ulElement = document.querySelector('#postList');
  if (!ulElement) return;

  ulElement.textContent = '';

  postList.forEach((post) => {
    const liElement = creatPostElement(post);
    ulElement.appendChild(liElement);
  });
}
