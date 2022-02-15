import dayjs from 'dayjs';
import postApi from './api/postApi';
import { lightBox } from './ultils';
import { setTextContent } from './ultils/common';

function renderPostDetail(post) {
  if (!post) return;
  setTextContent(document, '#postDeatilTitle', post.title);
  setTextContent(document, '#postContentDescription', post.description);
  setTextContent(document, '#postDetailAuthor', post.author);
  setTextContent(document, '#postDetialTimeSpan', dayjs(post.updatedAt).format('- DD/MM/YYYY'));

  // render heroImage

  const heroImage = document.querySelector('#postHeroImage');
  if (!heroImage) return;
  heroImage.style.backgroundImage = `url(${post.imageUrl})`;
  heroImage.addEventListener('error', () => {});

  const editPageLinkEl = document.querySelector('#goToEditPageLink');
  if (editPageLinkEl) {
    editPageLinkEl.innerHTML = '<i class="far fa-edit"></i>Edit Page';
    editPageLinkEl.href = `/add-edit-post.html?id=${post.id}`;
  }
}

(async () => {
  lightBox({
    modalId: 'lightBox',
    imgSelector: 'img[data-id="lightBoxImg"]',
    preSelector: 'button[data-id="lightBoxPre"]',
    nextSelector: 'button[data-id="lightBoxNext"]',
  });
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');

    if (!postId) {
      return;
    }

    const data = await postApi.getById(postId);
    renderPostDetail(data);
  } catch (error) {
    console.log('fail to load post detail pgae', error);
  }
})();
