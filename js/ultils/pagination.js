function setIncreasePageNumber(numberPageList, increaseNumber) {
  if (!increaseNumber) increaseNumber = 1;
  numberPageList.forEach((numberPage) => {
    let numberPageLink = numberPage.firstElementChild;
    const numberPageValue = Number.parseInt(numberPageLink.innerText);
    numberPageLink.innerText = numberPageValue + increaseNumber;
  });
}

function setDecreasePageNumber(numberPageList, decreaseNumber) {
  if (!decreaseNumber) decreaseNumber = 1;
  numberPageList.forEach((numberPage) => {
    let numberPageLink = numberPage.firstElementChild;
    const numberPageValue = Number.parseInt(numberPageLink.innerText);
    numberPageLink.innerText = numberPageValue - decreaseNumber;
  });
}

function setPageNumberActive(numberPageList, numberPageValue) {
  if (!numberPageValue) numberPageValue = 1;

  numberPageList.forEach((numberPage) => {
    if (numberPage.innerText == numberPageValue) {
      numberPage?.firstElementChild.classList.add('active-page');
    } else {
      numberPage?.firstElementChild.classList.remove('active-page');
    }
  });
}

function setDeactivePageNumber(numberPageList, page) {
  numberPageList.forEach((numberPage) => {
    if (numberPage.innerText == page + 1) {
      numberPage.classList.add('disabled');
    } else {
      numberPage.classList.remove('disabled');
    }
  });
}

export function initPagination({ elementId, defaultParams, onChange }) {
  const ulElement = document.getElementById(elementId);

  if (!ulElement) return;
  const preLink = ulElement.firstElementChild?.firstElementChild;
  const nextLink = ulElement.lastElementChild?.lastElementChild;

  const numberPageList = ulElement.querySelectorAll('li:not(:first-child):not(:last-child)');

  numberPageList.forEach((numberPage, index) => {
    numberPage.addEventListener('click', function (e) {
      e.preventDefault();
      const page = Number.parseInt(ulElement.dataset.page);
      const totalPages = Number.parseInt(ulElement.dataset.totalPages);
      let numberValue = Number.parseInt(numberPage.innerText);

      if (page + 1 >= totalPages) {
        setDeactivePageNumber(numberPageList, page, totalPages);
        // return;
      }
      onChange?.(numberValue);
      if (index != numberPageList.length - 1) setPageNumberActive(numberPageList, numberValue);
      if (index === numberPageList.length - 1) {
        setIncreasePageNumber(numberPageList);
        setPageNumberActive(numberPageList, numberValue);
      }

      if (index == 0 && numberValue > 1) {
        setDecreasePageNumber(numberPageList);
        setPageNumberActive(numberPageList, numberValue);
      }
    });
  });

  preLink.addEventListener('click', (e) => {
    e.preventDefault();
    const page = Number.parseInt(ulElement.dataset.page);

    let lastPageValue = Array.from(numberPageList)[0].innerText;
    if (lastPageValue > page - 1) setDecreasePageNumber(numberPageList);

    setPageNumberActive(numberPageList, page - 1);
    if (page >= 2) onChange(page - 1);
  });

  nextLink.addEventListener('click', (e) => {
    e.preventDefault();
    const page = Number.parseInt(ulElement.dataset.page) || 1;
    const totalPages = Number.parseInt(ulElement.dataset.totalPages);

    let lastPageValue = Array.from(numberPageList)[numberPageList.length - 1].innerText;
    if (lastPageValue < page + 1) setIncreasePageNumber(numberPageList);

    setPageNumberActive(numberPageList, page + 1);
    if (totalPages >= page) onChange?.(page + 1);
  });
}

export function renderPagination(elementId, pagination) {
  const { _page, _limit, _totalRows } = pagination;
  const totalPages = Math.ceil(_totalRows / _page);

  const ulElement = document.getElementById(elementId);
  ulElement.dataset.page = _page;
  ulElement.dataset.totalPages = totalPages;

  if (_page <= 1) ulElement.firstElementChild?.classList.add('disabled');
  else ulElement.firstElementChild?.classList.remove('disabled');

  if (_page >= totalPages) ulElement.lastElementChild?.classList.add('disabled');
  else ulElement.lastElementChild?.classList.remove('disabled');
}

(() => {
  const URLParam = new URLSearchParams(window.location.search);
  const _page = URLParam.get('_page');

  const numberPageList = document.querySelectorAll(
    '#pagination  li:not(:first-child):not(:last-child)'
  );
  const lastPage = numberPageList[numberPageList.length - 1].innerText;
  setIncreasePageNumber(numberPageList, _page - lastPage);
  setPageNumberActive(numberPageList, _page);
})();
