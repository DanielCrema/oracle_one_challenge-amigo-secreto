//O principal objetivo deste desafio é fortalecer suas habilidades em lógica de programação. Aqui você deverá desenvolver a lógica para resolver o problema.


/**
 * 
 * Lógicas globais do modal
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
    if (friendsArray.length === 0) {
        const tituloListaAmigos = document.getElementById('tituloListaAmigos');
        tituloListaAmigos.style.display = 'block';
    }
    friendsArray.push(friendItem);

    // Lógica de manipulação do DOM
    const friendsList = document.getElementById('listaAmigos');
    const li = friendsList.appendChild(document.createElement("li"));
    li.classList.add('listItem');
    li.setAttribute("id", `item-${friendItem.id}`);

    // Cria ícone cosmético
    const imgRightArrow = li.appendChild(document.createElement("img"));
    imgRightArrow.classList.add('iconRightArrow');
    imgRightArrow.setAttribute("src", "/assets/right-arrow.png");
    imgRightArrow.setAttribute("alt", `${friendItem.friendName}`);

    // Cria e configura o botão destrutivo
    const imgButtonDestructive = li.appendChild(document.createElement("img"));
    imgButtonDestructive.classList.add('buttonDestructive');
    imgButtonDestructive.setAttribute("src", "/assets/red-trash-can-icon.png");
    imgButtonDestructive.setAttribute("alt", `Excluir ${friendItem.friendName}`);
    const p = li.appendChild(document.createElement("p"));
    imgButtonDestructive.addEventListener('click', () => {
        const itemId = li.id.match(/\d/)[0]
        deleteItem(itemId);
    })

    p.innerHTML = friendItem.friendName;
    currentFriendId++
    inputFriendName.value = '';
    console.log("Adicionado com sucesso");
    console.log(friendsArray);
}

// Função para apagar um nome da lista
function deleteItem(id) {
    if (friendsArray.length === 1) {
        const tituloListaAmigos = document.getElementById('tituloListaAmigos');
        tituloListaAmigos.style.display = 'none';
    }
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

// Adicionar nome com Enter
inputFriendName.addEventListener('keyup', (e) => {
    if (inputFriendName.value !== '' && e.key === 'Enter') {
        addFriend();
    }
});


/**
 * 
 * Lógica para gerenciar os
 * processos de UI/UX do sorteio
 * 
**/

let sortedIds = [];
// UI para confirmar o início do sorteio
function confirmDrawStart() {
    if (friendsArray.length < 3) {
        displayModal('withSubtitle', 'singleButton', {
            title: `Impossível realizar sorteio`,
            subtitle: `Certifique-se de incluir pelo menos <span style="font-weight: 700">3</span> pessoas`
        });
    } else {
        displayModal('withSubtitle', 'twoButtons', {
            title: `O sorteio irá começar`,
            subtitle: `Após iniciar o sorteio não será possível adicionar ou remover nomes da lista`
        });
        const confirmButton = document.getElementById('confirmButton');
        confirmButton.addEventListener('click', () => {
            startDraw();
            backdrop.style.display = 'none';
            containerModal.style.display = 'none';
        }, { once: true });
    }
};

// Configura UI do sorteio
function startDraw() {
    toggleDisplay('input', 'disable');
    toggleDisplay('addButton', 'disable');
    toggleDisplay('buttonDestructive', 'disable');
    toggleDisplay('iconRightArrow', 'enable');
    toggleDisplay('buttonDraw', 'enable');
    toggleDisplay('buttonCancelDraw', 'enable');
};

// UI para confirmar cancelamento do sorteio
function confirmDrawCancel() {
    displayModal('withSubtitle', 'twoButtons', {
        title: `Tem certeza que deseja cancelar?`,
        subtitle: `Clicando em confirmar você terá que recomeçar o sorteio do início`
    });
    const confirmButton = document.getElementById('confirmButton');
    confirmButton.addEventListener('click', () => {
        endDraw();
        backdrop.style.display = 'none';
        containerModal.style.display = 'none';
    }, { once: true });
};

// Configura UI saindo do sorteio
function endDraw() {
    toggleDisplay('input', 'enable');
    toggleDisplay('addButton', 'enable');
    toggleDisplay('buttonDestructive', 'enable');
    toggleDisplay('iconRightArrow', 'disable');
    toggleDisplay('buttonDraw', 'disable');
    toggleDisplay('buttonCancelDraw', 'disable');
};

// Lógicas para manipular o DOM iniciando e saindo do sorteio
function toggleDisplay(element, parameter) {
    switch (element) {
        case 'input':
            if (parameter === 'disable') {
                inputFriendName.disabled = true;
                inputFriendName.style.caretColor = 'transparent';
                inputFriendName.removeAttribute('placeholder');
                inputFriendName.style.backgroundColor = 'var(--color-tertiary)';
            } else if (parameter === 'enable') {
                inputFriendName.disabled = false;
                inputFriendName.style.caretColor = 'auto';
                inputFriendName.setAttribute('placeholder', 'Digite um nome');
                inputFriendName.style.backgroundColor = '#FFF';
            }
            break;
        case 'addButton':
            const addButton = document.querySelector('.button-add');
            if (parameter === 'disable') {
                addButton.removeAttribute('onclick');
            } else if (parameter === 'enable') {
                addButton.setAttribute('onclick', 'addFriend()');
            }
            break;
        case 'buttonDraw':
            const buttonDraw = document.querySelector('.button-draw-action');
            if (parameter === 'disable') {
                buttonDraw.setAttribute('onclick', 'confirmDrawStart()');
                const p = buttonDraw.querySelector('p');
                p.innerHTML = 'Iniciar Sorteio';
            } else if (parameter === 'enable') {
                buttonDraw.setAttribute('onclick', 'drawFriend()');
                const p = buttonDraw.querySelector('p');
                p.innerHTML = 'Sortear Nome';
            }
            break;
        case 'buttonCancelDraw':
            const cancelDrawButton = document.querySelector('.button-cancel-draw');
            if (parameter === 'disable') {
                cancelDrawButton.style.display = 'none';
            } else if (parameter === 'enable') {
                cancelDrawButton.style.display = 'flex';
            }
            break;
        case 'buttonDestructive':
            if (parameter === 'disable') {
                const buttonDestructive = document.querySelectorAll('.buttonDestructive');
                buttonDestructive.forEach((button) => {
                    button.style.display = 'none';
                })
            } else if (parameter === 'enable') {
                const buttonDestructive = document.querySelectorAll('.buttonDestructive');
                buttonDestructive.forEach((button) => {
                    button.style.display = 'block';
                })
            }
            break;
        case 'iconRightArrow':
            if (parameter === 'disable') {
                const iconRightArrow = document.querySelectorAll('.iconRightArrow');
                iconRightArrow.forEach((icon) => {
                    icon.style.display = 'none';
                })
            } else if (parameter === 'enable') {
                const iconRightArrow = document.querySelectorAll('.iconRightArrow');
                iconRightArrow.forEach((icon) => {
                    icon.style.display = 'block';
                })
            }
            break;
    }
}


/**
 * Lógicas do Sorteio
*/

// Gerador de IDs aleatórios
function generateRandomId() {
    let randomId = Math.floor(Math.random() * friendsArray.length);

    if (sortedIds.includes(randomId)) {
        if (friendsArray.length > sortedIds.length) {
            return generateRandomId();
        } else {
            return false;
        }
    } else {
        sortedIds.push(randomId);
        return randomId;
    }
}

// Sortear um amigo aleatório
function drawFriend() {
    const randomId = generateRandomId(friendsArray);
    if (randomId !== false) {
        const friendName = friendsArray[randomId].friendName;
        displayResult(friendName);
    } else {
        setupEndGameEnvironment();
    }
    // console.log('friendsArray = ', friendsArray);
    // console.log('sortedIds = ', sortedIds);
}


/**
 * Lógica para gerenciar os processos
 *  de UI/UX durante o sorteio
*/

// Gerenciar o botão de exibir e ocultar o nome do amigo
let friendShown = false;
const buttonToggleFriendName = document.getElementById('displayFriendNameButton');
const friendNameParagraph = document.getElementById('friendName');
buttonToggleFriendName.addEventListener('click', () => {
    toggleFriendName();
});

function toggleFriendName() {
    if (friendShown) {
        friendShown = false;
        buttonToggleFriendName.innerText = 'Exibir Nome';
        friendNameParagraph.style.display = 'none';
    } else {
        friendShown = true;
        buttonToggleFriendName.innerText = 'Ocultar Nome';
        friendNameParagraph.style.display = 'block';
    }
}

// Exibir o modal com o nome do amigo
function displayResult(friendName) {
    // Mudar o <p> do modal para o nome do amigo
    // e reinicializar o layout
    friendNameParagraph.innerHTML = friendName;
    friendNameParagraph.style.display = 'none';
    buttonToggleFriendName.innerText = 'Exibir Nome';

    // Exibir o modal
    const containerFriendName = document.getElementById('containerFriendName');
    containerFriendName.style.display = 'flex';
    displayModal('withSubtitle', 'singleButton', {
        title: `Amigo sorteado:`,
        subtitle: `Certifique-se que nenhum xereta está olhando`
    });
}

function setupEndGameEnvironment() {
    // Esconde o container de nome do modal
    const containerFriendName = document.getElementById('containerFriendName');
    containerFriendName.style.display = 'none';
    
    // Configura o botão de iniciar novo sorteio
    const buttonCancelDraw = document.querySelector('.button-cancel-draw');
    buttonCancelDraw.removeAttribute('onclick');
    buttonCancelDraw.setAttribute('onclick', 'confirmRestart()');
    const p = buttonCancelDraw.querySelector('p');
    p.innerHTML = 'Novo Sorteio';
}


/**
 * Lógica para gerenciar os processos
 *  de UI/UX após o sorteio
*/

// 
function confirmRestart() {
    displayModal('withSubtitle', 'twoButtons', {
        title: `Tem certeza que quer reiniciar?`,
        subtitle: `Os nomes do sorteio anterior serão perdidos`
    });
    const confirmButton = document.getElementById('confirmButton');
    confirmButton.addEventListener('click', () => {
        restart();
        backdrop.style.display = 'none';
        containerModal.style.display = 'none';
    }, { once: true });
}

// Limpa tudo para começar um novo sorteio
function restart() {
    // Limpa os arrays
    friendsArray = [];
    sortedIds = [];

    // Reabilita o input e o botão de adicionar
    toggleDisplay('input', 'enable');
    toggleDisplay('addButton', 'enable');

    // Limpa a lista de amigos
    const listaAmigos = document.getElementById('listaAmigos');
    listaAmigos.innerHTML = '';
    const tituloListaAmigos = document.getElementById('tituloListaAmigos');
    tituloListaAmigos.style.display = 'none';

    // Reinicializa o botão de cancelar para
    // sua funcionalidade original
    toggleDisplay('buttonCancelDraw', 'disable');
    const buttonCancelDraw = document.querySelector('.button-cancel-draw');
    buttonCancelDraw.setAttribute('onclick', 'confirmDrawCancel()');
    const buttonCancelDrawParagraph = buttonCancelDraw.querySelector('p');
    buttonCancelDrawParagraph.innerHTML = 'Cancelar Sorteio';

    // Reinicializa o botão de Iniciar Sorteio para sua funcionalidade original
    toggleDisplay('buttonDraw', 'disable');
    const buttonDraw = document.querySelector('.button-draw-action');
    buttonDraw.setAttribute('onclick', 'confirmDrawStart()');
    const buttonDrawParagraph = buttonDraw.querySelector('p');
    buttonDrawParagraph.innerHTML = 'Iniciar Sorteio';
}

// Reinicia o sorteio atual
function drawAgain() {
    // Limpa o array do sorteio
    sortedIds = [];
}