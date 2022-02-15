import postApi from './api/postApi';
import { randomNumber, setBackgroundImg, setFormValue, setTextContent, toast } from './ultils';
import * as yup from 'yup';

const imageSource = {
  PICSUM: 'picsum',
  UPLOAD: 'upload',
};

function getFormValue(formEl) {
  let formValue = {};
  let data = new FormData(formEl);

  for (const [key, value] of data) {
    formValue[key] = value;
  }
  return formValue;
}

function setFieldError(form, name, error) {
  const element = form.querySelector(`[name=${name}]`);
  if (element) {
    element.setCustomValidity(error);
    setTextContent(element.parentElement, '.invalid-feedback', error);
  }
}

function getPostSchema() {
  return yup.object().shape({
    title: yup.string().required('Plase enter title'),
    author: yup
      .string()
      .required('Plase enter author name')
      .test(
        'at-least-2-words',
        'Please enter at least two words',
        (value) => value.split(' ').filter((x) => !!x && x.length >= 3).length >= 2
      ),
    description: yup.string(),
    imageSource: yup
      .string()
      .required('Please select your image source')
      .oneOf([imageSource.PICSUM, imageSource.UPLOAD]),

    imageUrl: yup.string().when('imageSource', {
      is: imageSource.PICSUM,
      then: yup
        .string()
        .required('Plase random an image for your background')
        .url('Please enter a valid image URL'),
    }),

    image: yup.mixed().when('imageSource', {
      is: imageSource.UPLOAD,
      then: yup
        .mixed()
        .test('required', 'Plase upload your image', (file) => file?.size > 1)
        .test('required', 'Plase select the file < 1MB', (file) => file?.size < 1000 * 1024),
    }),
  });
}

function randomImage(formEl) {
  let randomImageBtnEl = document.getElementById('randomImgBtn');
  if (!randomImageBtnEl) return;

  randomImageBtnEl.addEventListener('click', () => {
    let imageUrl = `https://picsum.photos/id/${randomNumber(1000)}/1366/400`;
    setFormValue(formEl, "[name='imageUrl']", imageUrl);
    setBackgroundImg(document, 'postHeroImage', imageUrl);
  });
}

//--------------------------------------------------------------------------------------------------Option random img start

function renderOptionRandomImg(value) {
  let radioControlList = document.querySelectorAll('[data-id="imageSource"]');
  radioControlList.forEach((control) => {
    control.hidden = control.dataset.imageSource != value;
  });
}

function handleUploadImage(formEl) {
  const inputEl = formEl.querySelector('[name="image"]');
  if (!inputEl) return;
  inputEl.addEventListener('change', (e) => {
    const file = inputEl.files[0];

    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setFormValue(formEl, "[name='imageUrl']", imageUrl);
    setBackgroundImg(document, 'postHeroImage', imageUrl);

    validateFormField(formEl, { imageSource: imageSource.UPLOAD, image: file }, 'image');
  });
}
//--------------Option random img end

//--------------------------------------------------------------------------------------------------Option random img start
function removeUnuseField(formValue) {
  const payload = { ...formValue };

  if (payload.imageSource == imageSource.PICSUM) delete payload.image;
  if (payload.imageSource == imageSource.UPLOAD) delete payload.imageUrl;

  delete payload.imageSource;

  return payload;
}

function jsonToFormData(jsonObj) {
  const formData = new FormData();

  for (const key in jsonObj) {
    formData.set(key, jsonObj[key]);
  }

  return formData;
}

async function handlePostFormSubmit(formValue) {
  try {
    const payload = removeUnuseField(formValue);
    const formData = jsonToFormData(payload);

    let savedPost = formValue.id
      ? await postApi.updateFormData(formValue)
      : await postApi.addFormData(formData);
    toast.success('save post successfully!');

    setTimeout(() => window.location.assign(`/post-detail.html?id=${savedPost.id}`), 2000);
  } catch (error) {
    console.log(error);
    toast.error(`Error: ${error.message}`);
  }
}

async function validatePostForm(form, formValue) {
  try {
    //Reset errors before validate
    ['title', 'author', 'imageUrl', 'image'].forEach((name) => {
      setFieldError(form, name, '');
    });

    const schema = getPostSchema();
    await schema.validate(formValue, { abortEarly: false });
  } catch (error) {
    let errorsLog = {};
    if (error.name === 'ValidationError') {
      for (const validationError of error.inner) {
        const name = validationError.path;

        if (errorsLog[name]) {
          continue;
        }
        setFieldError(form, name, validationError.message);
        errorsLog[name] = true;
      }
    }
  }

  const isValid = form.checkValidity();
  if (!isValid) form.classList.add('was-validated');
  return isValid;
}

async function validateFormField(form, formValue, name) {
  try {
    setFieldError(form, name, '');
    const schema = getPostSchema();
    await schema.validateAt(name, formValue);
  } catch (error) {
    setFieldError(form, name, error.message);
  }

  const field = form.querySelector(`[name="${name}"]`);
  if (field & !field.checkValidity()) {
    field.parentElement.classList.add('was-validated');
  }
}

function validateInputField(formEl) {
  ['title', 'author'].forEach((name) => {
    const selector = formEl.querySelector(`[name=${name}]`);
    if (selector) {
      selector.addEventListener('input', (e) => {
        validateFormField(formEl, { [name]: e.target.value }, name);
      });
    }
  });
}

(async () => {
  const URLParam = new URLSearchParams(window.location.search);
  const postId = URLParam.get('id');

  let defaultValue = postId
    ? await postApi.getById(postId)
    : {
        author: '',
        title: '',
        description: '',
        imageUrl: '',
      };

  const formEl = document.getElementById('postForm');
  setFormValue(formEl, "[name='author']", defaultValue.author);
  setFormValue(formEl, "[name='title']", defaultValue.title);
  setFormValue(formEl, "[name='description']", defaultValue.description);
  setFormValue(formEl, "[name='imageUrl']", defaultValue.imageUrl);
  setBackgroundImg(document, 'postHeroImage', defaultValue.imageUrl);

  validateInputField(formEl);

  let randomOptions = formEl.querySelectorAll("[name='imageSource']");
  randomOptions.forEach((randomOption) => {
    randomOption.addEventListener('change', (e) => {
      renderOptionRandomImg(e.target.value);
    });
  });

  randomImage(formEl);
  handleUploadImage(formEl);

  let isSubmiting = false;

  function showLoading() {
    const saveBnt = document.querySelector('.btn-save');
    if (saveBnt) {
      saveBnt.innerText = 'Saving...';
      saveBnt.disabled = true;
    }
  }

  function hideLoading() {
    const saveBnt = document.querySelector('.btn-save');
    if (saveBnt) {
      saveBnt.innerText = 'Save';
      saveBnt.disabled = false;
    }
  }

  formEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (isSubmiting) return;
    isSubmiting = true;

    const formValue = getFormValue(formEl);

    const isValid = await validatePostForm(formEl, formValue);
    showLoading();
    if (isValid) await handlePostFormSubmit(formValue);
    hideLoading();
    isSubmiting = false;
  });
})();
