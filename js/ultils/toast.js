import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

export const toast = {
  info(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: { background: '#29b6f6' },
    }).showToast();
  },

  success(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: { background: '#66bb6a' },
    }).showToast();
  },

  error(message) {
    Toastify({
      text: message,
      duration: 3000,
      close: true,
      gravity: 'top', // `top` or `bottom`
      position: 'right', // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: { background: '#f44336' },
    }).showToast();
  },
};
