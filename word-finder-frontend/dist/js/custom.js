const openModalButton = document.getElementById('openModalButton');
const closeModalButton = document.getElementById('closeModalButton');
const modal = document.getElementById('myModal');

// Show modal on button click
openModalButton.addEventListener('click', () => {
    modal.classList.remove('hidden');
});

// Hide modal on close button click
closeModalButton.addEventListener('click', () => {
    modal.classList.add('hidden');
});