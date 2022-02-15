export function lightBox({ modalId, imgSelector, preSelector, nextSelector }) {
  // handle click on all img => event delegation
  // find all img of post detail
  // detemine index of each img
  // show modal for clicked img
  // handle pre/next
  const modalEl = document.getElementById(modalId);
  const modalImg = document.querySelector(imgSelector);
  const preBtn = document.querySelector(preSelector);
  const nextBtn = document.querySelector(nextSelector);

  const modalInfoImg = document.getElementById('numberOfImg');

  let imgList = [];
  let currentIndex = 0;

  function showModalImg(index) {
    modalImg.src = imgList[index].src;
    modalInfoImg.textContent = `Image ${index + 1} / ${imgList.length}`;
    myModal.show();
  }

  if (!modalEl) return;
  let myModal = new bootstrap.Modal(modalEl);

  document.addEventListener('click', (e) => {
    const { target } = e;
    if (target.tagName !== 'IMG' || !target.dataset.album) return;
    imgList = document.querySelectorAll('img[data-album = "post-album"]');
    currentIndex = [...imgList].findIndex((x) => x === target); //Array method is not apply to nodelist (album)

    showModalImg(currentIndex);
  });

  preBtn.addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + imgList.length) % imgList.length;
    showModalImg(currentIndex);
  });
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % imgList.length;
    showModalImg(currentIndex);
  });
}
