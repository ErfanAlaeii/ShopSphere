const notyf = new Notyf();

window.showSuccessNotification = (message) => {
  notyf.success(message);
};

window.showErrorNotification = (message) => {
  notyf.error(message);
};
