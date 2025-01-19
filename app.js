//O principal objetivo deste desafio é fortalecer suas habilidades em lógica de programação. Aqui você deverá desenvolver a lógica para resolver o problema.

// Capturando os elementos
// do modal e do input no HTML
const backdrop = document.getElementById('backdrop');
const containerModal = document.getElementById('containerModal');
const containerWarningMessage = document.getElementById('containerWarningMessage');
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

// Lógica para gerenciar a inclusão de nomes na lista
// 
const friendsArray = [];
let currentFriendId = 0;

// Função para validar o nome
function validateFriendName(friendName) {
    // Função para verificar se o nome sendo adicionado já existe na lista
    function verifyNamesInArray(arr, nome) {
        function extractNamesFromArrayInnerObjects(arr) {
            const namesArray = [];
            arr.forEach((element) => {
                namesArray.push(element.friendName);
            })
            return namesArray
        };

        if (typeof arr[0] == 'object') {
            arr = extractNamesFromArrayInnerObjects(arr);
        }
        const found = arr.find((element) => element.toLowerCase() == nome.toLowerCase());

        return found
    }

    let isValid = false;
    if (friendName !== '') {
        const validationRegex = /^[a-z]*$/i;
        if (validationRegex.test(friendName)) {
            if (!verifyNamesInArray(friendsArray, friendName)) {
                isValid = true;
            } else {
                displayModal('noSubtitle', {
                    title: 'Este nome já foi adicionado à lista',
                });
            }
        } else {
            displayModal('withSubtitle', {
                title: `O nome <span style="font-weight: 900">${friendName}</span> não é um nome válido`,
                subtitle: `Certifique-se de incluir apenas letras nos nomes`
            });
        }
    } else {
        displayModal('noSubtitle', {
            title: 'Por favor, insira um nome',
        });
    }

    return isValid
}