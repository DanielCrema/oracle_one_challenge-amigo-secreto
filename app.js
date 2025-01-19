//O principal objetivo deste desafio é fortalecer suas habilidades em lógica de programação. Aqui você deverá desenvolver a lógica para resolver o problema.

/**
 * 
 * Lógica do modal
 * 
**/
// Capturando os elementos
// do modal e do input no HTML
const backdrop = document.getElementById('backdrop');
const containerModal = document.getElementById('containerModal');
const containerWarningMessage = document.getElementById('containerWarningMessage');
const warningTitle = document.getElementById('warningTitle');
const warningSubtitleDiv = document.getElementById('missingField');
const warningExitButton = document.getElementById('warningExitButton');
const containerConfirmButtons = document.getElementById('containerConfirmButtons');
const cancelButton = document.getElementById('cancelButton');
const inputFriendName = document.getElementById('amigo');

// Lógica para gerenciar os botões de fechar o modal
warningExitButton.addEventListener('click', () => {
    backdrop.style.display = 'none';
    containerModal.style.display = 'none';
    inputFriendName.value = '';
});
cancelButton.addEventListener('click', () => {
    backdrop.style.display = 'none';
    containerModal.style.display = 'none';
    inputFriendName.value = '';
});

// Função para exibir o modal
function displayModal(displayCase, buttonLayout, alertMessage) {
    warningTitle.innerHTML = alertMessage.title;
    if (buttonLayout === 'singleButton') {
        warningExitButton.style.display = 'block';
        containerConfirmButtons.style.display = 'none';
    } else if (buttonLayout === 'twoButtons') {
        warningExitButton.style.display = 'none';
        containerConfirmButtons.style.display = 'flex';
    }

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

/**
 * 
 * Lógica para gerenciar a inclusão
 * e exclusão de nomes na lista
 * 
**/
let friendsArray = [];
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
                displayModal('noSubtitle', 'singleButton', {
                    title: 'Este nome já foi adicionado à lista',
                });
            }
        } else {
            displayModal('withSubtitle', 'singleButton', {
                title: `O nome <span style="font-weight: 900">${friendName}</span> não é um nome válido`,
                subtitle: `Certifique-se de incluir apenas letras nos nomes`
            });
        }
    } else {
        displayModal('noSubtitle', 'singleButton', {
            title: 'Por favor, insira um nome',
        });
    }

    return isValid
}

// Função 'onclick' do botão de adicionar nome
function addFriend() {
    const friendName = inputFriendName.value;
    if (validateFriendName(friendName)) {
        const normalizedFriendName = friendName[0].toUpperCase() + friendName.substring(1);
        const friendItem = {
            id: currentFriendId,
            friendName: normalizedFriendName
        }
        addToList(friendItem);
    }
}

// Função para adicionar nomes na lista de amigos
function addToList(friendItem) {
    friendsArray.push(friendItem);
    const friendsList = document.getElementById('listaAmigos');
    const li = friendsList.appendChild(document.createElement("li"));
    li.classList.add('listItem');
    li.setAttribute("id", `item-${friendItem.id}`);
    const img = li.appendChild(document.createElement("img"));
    img.classList.add('buttonDestructive');
    img.setAttribute("src", "/assets/red-trash-can-icon.png");
    img.setAttribute("alt", `Excluir ${friendItem.friendName}`);
    const p = li.appendChild(document.createElement("p"));
    img.addEventListener('click', () => {
        const itemId = li.id.match(/\d/)[0]
        deleteItem(itemId);
    })
    p.innerHTML = friendItem.friendName;
    currentFriendId++
    inputFriendName.value = '';
    console.log("Adicionado com sucesso");
    console.log(friendsArray);
}

function deleteItem(id) {
    const newArray = friendsArray
    .filter((friendItem) => friendItem.id !== parseInt(id))
    .map((friendItem, index) => {
        // Update ids for the remaining items
        friendItem.id = index;
        return friendItem;
    });

    const friendsList = document.getElementById('listaAmigos');
    friendsList.innerHTML = '';
    friendsArray = [];
    currentFriendId = 0
    newArray.forEach((friendItem) => {
        addToList(friendItem);
    });
}

/**
 * Adicionar nome com Enter
*/
inputFriendName.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        addFriend();
    }
});