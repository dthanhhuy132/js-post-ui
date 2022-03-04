import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import postApi from './api/postApi';
import { initPagination, initSearch, renderPagination, renderPostList, toast } from './ultils';
dayjs.extend(relativeTime);

// ------------------------------------------------------------------------ PAGINATION

// ------------------------------------------------------------------------ FILTER START
async function handleFilterChange(filterName, filterValue) {
  try {
    const url = new URL(window.location);
    if (filterName === 'title_like') url.searchParams.set('_page', 1);
    if (filterName) url.searchParams.set(filterName, filterValue);

    history.pushState({}, '', url);
    const { data, pagination } = await postApi.getAll(url.searchParams);

    renderPostList(data);
    renderPagination('pagination', pagination);
    window.scrollTo(0, 0);
  } catch (error) {
    console.log('fail to load new post', error);
  }
}

function handleRemovePost() {
  document.addEventListener('post-delete', (e) => {
    const post = e.detail.post;
    const myModal = e.detail.myModal;
    const confirmBtn = document.querySelector('#confirm-delete');

    if (confirmBtn)
      confirmBtn.addEventListener('click', async () => {
        try {
          await postApi.remove(post.id);
          toast.success('Delete post successfully!!!');
          myModal.hide();

          handleFilterChange();
        } catch (error) {
          // toast.error(error.message);
          myModal.hide();
        }
      });
  });
}

(async () => {
  try {
    const url = new URL(window.location);

    if (!url.searchParams.get('_page')) url.searchParams.set('_page', 1);
    if (!url.searchParams.get('_limit')) url.searchParams.set('_limit', 6);

    history.pushState({}, '', url);
    const queryParams = url.searchParams;

    initPagination({
      elementId: 'pagination',
      defaultParams: queryParams,
      onChange: (page) => handleFilterChange('_page', page),
    });

    initSearch({
      elementId: 'searchInput',
      defaultParams: queryParams,
      onChange: (value) => handleFilterChange('title_like', value),
    });

    handleRemovePost();

    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
    renderPagination('pagination', pagination);

    // attack token to request if exist
  } catch (error) {}
})();
