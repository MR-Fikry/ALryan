document.getElementById('openModalBtn').onclick = () => {
  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
};

const closeModalFunc = () => {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
};