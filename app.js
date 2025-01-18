//O principal objetivo deste desafio é fortalecer suas habilidades em lógica de programação. Aqui você deverá desenvolver a lógica para resolver o problema.

// Capturando os elementos
// do modal e do input no HTML
const backdrop = document.getElementById('backdrop');
const containerModal = document.getElementById('containerModal');
const containerWarningMessage = document.getElementById('warningMessage');
const warningTitle = document.getElementById('warningTitle');
const warningSubtitleDiv = document.getElementById('missingField');
const warningExitButton = document.getElementById('warningExitButton');
const inputFriendName = document.getElementById('amigo');

// Lógica para gerenciar o botão de fechar o modal
warningExitButton.addEventListener('click', () => {
    backdrop.style.display = 'none';
    containerModal.style.display = 'none';
    inputFriendName.value = '';
});

// Função para exibir o modal
function displayModal(displayCase, alertMessage) {
    warningTitle.innerHTML = alertMessage.title;
    if (displayCase == 'noSubtitle') {
        warningSubtitleDiv.style.display = 'none';
        containerWarningMessage.style.width = '450px';
        containerWarningMessage.style.minHeight = '150px';
    } else if (displayCase == 'withSubtitle') {
        warningSubtitleDiv.innerHTML = `<p>${alertMessage.subtitle}</p>`;
        warningSubtitleDiv.style.display = 'flex';
        containerWarningMessage.style.width = '500px';
        containerWarningMessage.style.minHeight = '200px';
    }
    backdrop.style.display = 'block';
    containerModal.style.display = 'flex';
}