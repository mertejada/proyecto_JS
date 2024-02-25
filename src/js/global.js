let element = document.getElementById('close-session');

element.addEventListener('click', () => {
    localStorage.removeItem('currentUsername');
    window.location.href = 'index.html';
});