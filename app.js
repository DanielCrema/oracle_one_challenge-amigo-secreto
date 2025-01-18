//O principal objetivo deste desafio é fortalecer suas habilidades em lógica de programação. Aqui você deverá desenvolver a lógica para resolver o problema.

// Lógica para gerenciar o botão do modal
const backdrop = document.getElementById('backdrop');
const containerWarning = document.getElementById('containerWarning');
const warningExitButton = document.getElementById('warningExitButton');

warningExitButton.addEventListener('click', () => {
    backdrop.style.display = 'none';
    containerWarning.style.display = 'none';
});