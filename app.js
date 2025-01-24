//O principal objetivo deste desafio é fortalecer suas habilidades em lógica de programação. Aqui você deverá desenvolver a lógica para resolver o problema.


/**
 * 
 * Variáveis Globais
 * 
*/

// Lista de amigos adicionados ao sorteio atual
let friendsArray = [];

// Lista de amigos sorteados
let sortedIds = [];

// Contador de id do amigo para gerenciar inclusão e exclusão de amigos na lista
// inicializa em -1, index de array vazio, e incrementa antes de atribuir o
// id ao amigo, de forma que sempre apontará para o id do último da lista
let currentFriendId = -1;

// Gerenciador de estado de visibilidade do
// nome do amigo no modal durante o sorteio
let visibleFriendName = false;

// Gerenciador de scroll
// 
// Gerencia a posição da página para
// controle server-side do scroll
// 
// O scroll do usuário será desabilitado
let scrollAtTop = true;

// Controlador da largura dos itens da lista
// 
// Inicializa em 0 e é usado como parâmetro para
// harmonizar a largura dos elementos do grid
let listItensCurrentWidth = 70;


/**
 * 
 * Lógicas globais de UI/UX
 * 
*/

// Configura a UI inicial para mobile
// 
// Essa funcionalidade visa informar o usuário da existência do botão
// posto que o teclado do mobile o oculta quando é adicionado
// um nome, o que pode confundir o usuário
const isComputer = window.innerWidth > 768 ? true : false;
const buttonContainer = document.querySelector('.button-container');
if (!isComputer) {
    buttonContainer.style.display = 'flex';
    buttonContainer.style.padding = '80px 0 0';
}

// Adiciona dinamicidade ao jogo
// engajando o usuário quando um nome é adicionado
async function manageUserEngagementFlow(action) {
    // Função bloqueadora de scroll
    function blockScroll() {
        if (scrollAtTop) {
            window.scrollTo(0, 0);
        } else {
            window.scrollTo(0, document.body.scrollHeight);
        }
    }
    window.addEventListener('scroll', blockScroll);
    window.addEventListener('load', () => window.scrollTo(0, 0));

    // Capturando os elementos a serem manipulados
    const containerFriendsList = document.getElementById('containerListaAmigos');
    const containerDrawButtons = document.querySelector('.button-container');
    const containerFriendCounter = document.getElementById('containerContadorDeAmigos');

    // Lógica de flow
    if (action === 'clear') {
        // Gerencia o estado do scroll
        scrollAtTop = true;

        // Scroll suave para o topo
        window.scrollTo({ top: 0, behavior: "smooth" });

        // Reseta o layout
        updateTitle('clear');
        containerFriendCounter.style.display = 'none';
        containerFriendsList.style.display = 'none';
        if (isComputer) {
            containerDrawButtons.style.display = 'none';
        } else {
            buttonContainer.style.display = 'flex';
            buttonContainer.style.padding = '80px 0 0';
        }
        await new Promise(resolve => setTimeout(resolve, 100));
        blockScroll();
    }
    if (action === 'start') {
        // Gerencia o estado do scroll
        scrollAtTop = false;

        // Expande o layout
        updateTitle('addingStart');
        containerFriendCounter.style.display = 'flex';
        containerFriendsList.style.display = 'flex';
        containerDrawButtons.style.display = 'flex';

        // Scroll suave para o fim da página
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        await new Promise(resolve => setTimeout(resolve, 100));
        blockScroll();
    }
}

// Atualizador do contador de amigos
function updateFriendCounter() {
    const friendCounter = document.getElementById('contadorDeAmigos');
    const listItens = document.querySelectorAll('.listItem');
    const listLength = listItens.length;

    // Incrementa o valor no HTML e no contador de ID atual
    friendCounter.innerHTML = listLength.toString();
    currentFriendId = listLength;
}

// Atualizador da mensagem principal do jogo
function updateTitle(parameter) {
    const gameTitle = document.querySelector('.section-title');
    const containerTitle = document.getElementById('containerTitle');
    if (parameter === 'addingStart') {
        containerTitle.style.display = 'grid';
        gameTitle.innerText = 'Adicione seus amigos'
    } else if (parameter === 'drawStart') {
        gameTitle.innerText = 'O sorteio começou'
    } else if (parameter === 'drawEnd') {
        gameTitle.innerText = 'Fim do sorteio';
    } else if (parameter === 'clear') {
        containerTitle.style.display = 'block';
        gameTitle.innerText = 'Digite um nome para começar';
    }
}

// Gerencia a largura dos itens da lista para
// uma disposição geometricamente harmoniosa
function manageFriendsListItensMinWidth(width) {
    // Verifica a necessidade de modificar
    if (width > listItensCurrentWidth && width <= 130) {
        // Atualiza o min-width para todos os itens da lista
        const listItens = document.querySelectorAll('.listItem');
        listItens.forEach((item) => {
            item.style.minWidth = `${width}px`;
        });
    }
};

// Adicionar nome com Enter
const inputFriendName = document.getElementById('amigo');
const addButton = document.querySelector('.button-add');
inputFriendName.addEventListener('keyup', (e) => {
    if (inputFriendName.value !== '' && e.key === 'Enter') {
        addButton.click();
    }
});

// Bloqueia o input para nomes maiores que 20 caracteres
// Gerenciador de estado
let maxCharCountStatementVisible = false;
let twentyCharsNameContent = ''
function validateNameLength() {
    inputFriendName.addEventListener('input', (e) => {
        if (inputFriendName.value.length === 20) {
            twentyCharsNameContent = inputFriendName.value;
        }
        if (inputFriendName.value.length > 20) {
            // Trim the input to 20 characters
            inputFriendName.value = twentyCharsNameContent;
            const maxCharCountStatement = document.getElementById('maxCharCountStatement');
            // Configura o layout da mensagem
            if (e.key !== 'Delete' && e.key !== 'Backspace') {
                maxCharCountStatementVisible = true;
                maxCharCountStatement.style.color = 'rgb(210, 0, 0)';
                e.preventDefault();
            }

            // Configura o botão delete para remover a mensagem
            function removeMaxCharCountStatementFromDelete() {
                inputFriendName.addEventListener('keydown', (e) => {
                    if (e.key === 'Delete' && inputFriendName.value.length <= 20) {
                        maxCharCountStatementVisible = false;
                        maxCharCountStatement.style.color = 'transparent';
                    }
                })
            }

            // Configura o botão backspace para remover a mensagem
            function removeMaxCharCountStatementFromBackspace() {
                inputFriendName.addEventListener('keydown', (e) => {
                    if (e.key === 'Backspace' && inputFriendName.value.length <= 20) {
                        maxCharCountStatementVisible = false;
                        maxCharCountStatement.style.color = 'transparent';
                    }
                })
            }

            // Configura o botão enter para remover a mensagem
            function removeMaxCharCountStatementFromEnter() {
                inputFriendName.addEventListener('keyup', (e) => {
                    if (e.key === 'Enter') {
                        maxCharCountStatementVisible = false;
                        maxCharCountStatement.style.color = 'transparent';
                    }
                })
            }

            // Chama as funções
            if (maxCharCountStatementVisible) {
                removeMaxCharCountStatementFromDelete()
                removeMaxCharCountStatementFromBackspace()
                removeMaxCharCountStatementFromEnter()
            }
        }
        // Remove os listeners para evitar bugs por listener residual
        if (!maxCharCountStatementVisible) {
            inputFriendName.removeEventListener('keyup', removeMaxCharCountStatementFromDelete)
            inputFriendName.removeEventListener('keyup', removeMaxCharCountStatementFromBackspace)
            inputFriendName.removeEventListener('keyup', removeMaxCharCountStatementFromEnter)
        }
    });
}
validateNameLength();


// Automatiza o clique no input
// após validações por modal
function clickOnInput() {
    inputFriendName.focus();
}

/**
 * 
 * Lógicas globais do modal
 * 
**/

// Capturando os elementos
// do modal e do input no HTML
const backdrop = document.getElementById('backdrop');
const containerModal = document.getElementById('containerModal');
const containerModalMessage = document.getElementById('containerWarningMessage');
const modalTitle = document.getElementById('warningTitle');
const modalSubtitleDiv = document.getElementById('missingField');
const modalExitButton = document.getElementById('warningExitButton');
const containerConfirmButtons = document.getElementById('containerConfirmButtons');
const cancelButton = document.getElementById('cancelButton');

// Lógica para gerenciar os botões de fechar o modal
function setmodalExitButtonEventListener() {
    // Modal de botão único
    modalExitButton.addEventListener('click', () => {
        backdrop.style.display = 'none';
        containerModal.style.display = 'none';
        inputFriendName.value = '';
    });
}
function setCancelButtonEventListener() {
    // Modal de dois botões : Botão de cancelar
    cancelButton.addEventListener('click', () => {
        backdrop.style.display = 'none';
        containerModal.style.display = 'none';
        inputFriendName.value = '';
    });
}
setmodalExitButtonEventListener();
setCancelButtonEventListener();

// Função para exibir o modal
function displayModal(displayCase, buttonLayout, modalMessage) {
    modalTitle.innerHTML = '';
    modalTitle.innerHTML = modalMessage.title;
    if (buttonLayout === 'singleButton') {
        modalExitButton.style.display = 'block';
        containerConfirmButtons.style.display = 'none';
    } else if (buttonLayout === 'twoButtons') {
        modalExitButton.style.display = 'none';
        containerConfirmButtons.style.display = 'flex';
    }

    if (displayCase == 'noSubtitle') {
        modalTitle.style.fontWeight = 400;
        modalSubtitleDiv.style.display = 'none';
        containerModalMessage.style.width = '450px';
        containerModalMessage.style.minHeight = '150px';
    } else if (displayCase == 'withSubtitle') {
        modalTitle.style.fontWeight = '700';
        modalSubtitleDiv.innerHTML = '';
        modalSubtitleDiv.innerHTML = `<p>${modalMessage.subtitle}</p>`;
        modalSubtitleDiv.style.display = 'flex';
        containerModalMessage.style.width = '500px';
        containerModalMessage.style.minHeight = '200px';
    }

    backdrop.style.display = 'block';
    containerModal.style.display = 'flex';
    inputFriendName.blur();
}

// Gerador de listeners temporários para os diálogos de confirmação
// importante para evitar acúmulo de listeners residuais
function manageModalButtonTemporaryEventListeners(listenerFunction, buttonLayout) {
    // Configura o botão do modal de um botão
    if (buttonLayout === 'singleButton') {
        const modalExitButton = document.getElementById('warningExitButton');
        modalExitButton.addEventListener('click', () => {
            listenerFunction();
        }, { once: true });
        return
    }

    // Configura o botão do modal de dois botões
    // 
    const confirmButton = document.getElementById('confirmButton');
    const cancelButton = document.getElementById('cancelButton');

    // Limpador de listeners
    function clearListeners() {
        confirmButton.removeEventListener('click', listenerFunction);
        confirmButton.removeEventListener('click', clearListeners);
        cancelButton.removeEventListener('click', clearListeners);
    }

    // Aplica os listeners
    confirmButton.addEventListener('click', listenerFunction, { once: true });
    confirmButton.addEventListener('click', clearListeners, { once: true });
    cancelButton.addEventListener('click', clearListeners, { once: true });
}


/**
 * 
 * Lógica para gerenciar a inclusão
 * e exclusão de nomes na lista
 * 
**/

// Função para validar o nome
function validateFriendName(friendName) {
    // Função para verificar se o nome sendo adicionado já existe na lista
    function verifyNamesInArray(arr, nameToFind) {
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
        const found = arr.find((element) => element.toLowerCase() == nameToFind.toLowerCase());

        return found
    }

    let isValid = false;
    if (friendName !== '') {
        const validationRegex = /^[a-zà-öø-ÿ]+([ '-][.a-zà-öø-ÿ]+)*$/i;
        if (validationRegex.test(friendName)) {
            if (!verifyNamesInArray(friendsArray, friendName)) {
                isValid = true;
            } else {
                displayModal('noSubtitle', 'singleButton', {
                    title: 'Este nome já foi adicionado à lista',
                });
                manageModalButtonTemporaryEventListeners(clickOnInput, 'singleButton');
            }
        } else {
            // Configura e exibe o modal para os casos onde os caracteres permitidos
            // ' . ', ' ' ' e ' - ' estão presentes porém no lugar errado
            // 
            // Exemplos válidos: " João P. ", " D'Angelo ", " Van-Heuten "
            // Exemplos inválidos: " 'dan ", " -joão ", "jos.é" 
            if (/['-.]/.test(friendName)) {
                displayModal('noSubtitle', 'singleButton', {
                    title: `<p style="font-weight: 400">O nome <span style="font-weight: 900">"${friendName}"</span> não é um nome válido</p>`,
                });
                manageModalButtonTemporaryEventListeners(clickOnInput, 'singleButton');

                return isValid
            }

            // Captura os caracteres inválidos
            const invalidCharsRegex = /[^a-zà-öø-ÿ '-.]/gi
            const matches = friendName.match(invalidCharsRegex);
            const invalidCharsArray = [...new Set(matches)].filter((char) => /[a-zà-öø-ÿ]/.test(char) === false);

            /**
             * 
             * Formata a string do subtítulo do modal
             * 
            */

            // Inicializa a mensagem
            let subtitleString = '<div style="display: flex; flex-direction: column; justify-content: center"><p style="padding: 0px 40px 5px">Nomes não podem conter ';

            // Formata a mensagem para erro único
            // inicializa a mensagem de múltiplos erros
            subtitleString += invalidCharsArray.length > 1 ?
                'os caracteres:</p><div style="display: flex; gap: 10px; padding: 4px 25px 0px 20px"><p>=></p><p style="text-align: left">' :
                `o caractere "<span style="font-weight: 700">${invalidCharsArray[0]}</span>"</p>`;

            // Trata múltiplos erros
            // formatando a mensagem apropriadamente
            if (invalidCharsArray.length > 1) {
                for (let i = 0; i < invalidCharsArray.length; i++) {
                    subtitleString += `"<span style="font-weight: 700">${invalidCharsArray[i]}</span>"`;

                    const arrayLastIndex = invalidCharsArray.indexOf(invalidCharsArray[invalidCharsArray.length - 1]);
                    if (i < arrayLastIndex - 1) {
                        subtitleString += ', '
                    } else if (i === arrayLastIndex - 1) {
                        subtitleString += ' e '
                    } else if (i === arrayLastIndex) {
                        subtitleString += '</p></div>'
                    }
                }
            };
            subtitleString += '<span id="decorativeSeparator"></span>';
            subtitleString += '<p style="padding: 0px 40px 5px">Certifique-se de incluir um nome válido</p></div>';

            displayModal('withSubtitle', 'singleButton', {
                title: `<p style="font-weight: 400">O nome <span style="font-weight: 900">"${friendName}"</span> não é um nome válido</p>`,
                subtitle: subtitleString
            });
            manageModalButtonTemporaryEventListeners(clickOnInput, 'singleButton');

        }
    } else {
        displayModal('noSubtitle', 'singleButton', {
            title: 'Por favor, insira um nome',
        });
        manageModalButtonTemporaryEventListeners(clickOnInput, 'singleButton');

    }

    return isValid
}

// Função para reorganizar os amigos no array e no DOM
function reorganizeFriends(arr) {
    // Função aninhada para ordenar o array alfabeticamente
    function sortArray(arr) {
        // Extrai e ordena os nomes
        const sortedNames = arr.map(friend => friend.friendName).sort();

        // Reconstrói o array
        const orderedArray = sortedNames.map((name, index) => ({
            id: index,
            friendName: name
        }));

        return orderedArray;
    }

    // Ordena o array
    arr = sortArray(arr);

    // Limpa tudo e adiciona os amigos novamente 
    const friendsList = document.getElementById('listaAmigos');
    friendsList.innerHTML = '';
    friendsArray = [];
    currentFriendId = -1

    arr.forEach((friendItem) => {
        friendsArray.push(friendItem);
        addToList(friendItem);
    });
}

// Função para adicionar nomes na lista de amigos
function addToList(friendItem) {
    /**
     * Lógica de manipulação do DOM
    */

    // Configura o elemento do novo amigo
    const friendsList = document.getElementById('listaAmigos');
    const li = friendsList.appendChild(document.createElement("li"));
    li.classList.add('listItem');
    li.setAttribute("id", `item-${friendItem.id}`);

    // Cria ícone cosmético
    const imgRightArrow = li.appendChild(document.createElement("img"));
    imgRightArrow.classList.add('iconRightArrow');
    imgRightArrow.setAttribute("src", "./assets/right-arrow.png");
    imgRightArrow.setAttribute("alt", `${friendItem.friendName}`);

    // Cria e configura o botão destrutivo
    const imgButtonDestructive = li.appendChild(document.createElement("img"));
    imgButtonDestructive.classList.add('buttonDestructive');
    imgButtonDestructive.setAttribute("src", "./assets/red-trash-can-icon.png");
    imgButtonDestructive.setAttribute("alt", `Excluir ${friendItem.friendName}`);
    imgButtonDestructive.addEventListener('click', () => {
        const itemId = friendItem.id;
        deleteFriend(itemId);
    })

    // Configura o texto do <p>
    const p = li.appendChild(document.createElement("p"));
    p.innerHTML = friendItem.friendName;

    // Monitora e atualiza a largura dos elementos
    const itemWidth = li.offsetWidth;
    console.log(itemWidth)
    manageFriendsListItensMinWidth(itemWidth);

    // Atualiza o contador de amigos
    updateFriendCounter();
}

// Função 'onclick' do botão de adicionar nome
function addFriend() {
    const friendName = inputFriendName.value.trim();
    if (validateFriendName(friendName)) {
        // Normaliza o nome
        const normalizedFriendName = friendName.toLowerCase()
        .replace(/^[a-z]/, (match) => match.toUpperCase())
        .replace(/ [a-z]/gi, (match) => match.toUpperCase())
        .replace(/['][A-Z]/gi, (match) => match.toUpperCase())
        .replace(/[-][A-Z]/gi, (match) => match.toUpperCase());

        // Constrói o objeto
        const friendItem = {
            id: currentFriendId,
            friendName: normalizedFriendName
        }

        // Adiciona ao array
        if (friendsArray.length === 0) {
            manageUserEngagementFlow('start');
            updateFriendCounter();
        }
        friendsArray.push(friendItem);

        // Organiza o array e a apresentação no DOM
        reorganizeFriends(friendsArray);

        inputFriendName.value = '';
        clickOnInput();
    }
}

// Função para apagar um nome da lista
function deleteFriend(id) {
    if (friendsArray.length === 1) {
        manageUserEngagementFlow('clear');
        updateFriendCounter();
    }

    // Elimina o nome a ser apagado e gera um novo array
    const newFriendsArray = friendsArray
        .filter((friendItem) => friendItem.id !== parseInt(id))
        .map((friendItem, index) => {
            // Update ids for the remaining items
            friendItem.id = index;
            return friendItem;
        });

    // Ordena os nomes e reconstrói o array e o HTML
    reorganizeFriends(newFriendsArray);
}

// Função para limpar a lista de amigos
const clearListButton = document.getElementById('limparLista');
function confirmClearList() {
    const containerFriendName = document.getElementById('containerFriendName');
    containerFriendName.style.display = 'none';
    displayModal('withSubtitle', 'twoButtons', {
        title: `Tem certeza que deseja limpar?`,
        subtitle: `Clicando em confirmar você perderá os nomes já listados`
    });

    // Configura o listener do botão confirm do modal para limpar a lista
    function handleConfirm() {
        restart();
        backdrop.style.display = 'none';
        containerModal.style.display = 'none';
    }

    manageModalButtonTemporaryEventListeners(handleConfirm);
}
clearListButton.addEventListener('click', () => confirmClearList());


/**
 * 
 * Lógica para gerenciar os
 * processos de UI/UX do sorteio
 * 
**/

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

        // Configura o listener do botão confirm do modal para iniciar o sorteio
        function handleConfirm() {
            startDraw();
            backdrop.style.display = 'none';
            containerModal.style.display = 'none';
        }

        manageModalButtonTemporaryEventListeners(handleConfirm);
    }
};

// Configura UI do sorteio
function startDraw() {
    updateTitle('drawStart');
    toggleDisplay('input', 'disable');
    toggleDisplay('addButton', 'disable');
    toggleDisplay('buttonDestructive', 'disable');
    toggleDisplay('iconRightArrow', 'enable');
    toggleDisplay('buttonDraw', 'enable');
    toggleDisplay('buttonCancelDraw', 'enable');
};

// UI para confirmar cancelamento do sorteio
function confirmDrawCancel() {
    const containerFriendName = document.getElementById('containerFriendName');
    containerFriendName.style.display = 'none';
    displayModal('withSubtitle', 'twoButtons', {
        title: `Tem certeza que deseja cancelar?`,
        subtitle: `Clicando em confirmar você terá que recomeçar o sorteio do início`
    });

    // Configura o listener do botão confirm do modal para cancelar o sorteio
    function handleConfirm() {
        cancelDraw();
        backdrop.style.display = 'none';
        containerModal.style.display = 'none';
    }

    manageModalButtonTemporaryEventListeners(handleConfirm);
};

// Configura UI saindo do sorteio
function cancelDraw() {
    sortedIds = [];
    updateTitle('addingStart');
    toggleDisplay('input', 'enable');
    toggleDisplay('addButton', 'enable');
    toggleDisplay('buttonDestructive', 'enable');
    toggleDisplay('iconRightArrow', 'disable');
    toggleDisplay('buttonDraw', 'disable');
    toggleDisplay('buttonCancelDraw', 'disable');
};


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
    if (randomId === false) {
        setupEndGameEnvironment();
        return
    }
    const friendName = friendsArray[randomId].friendName;
    displayResult(friendName);
}


/**
 * Lógica para gerenciar os processos
 *  de UI/UX durante o sorteio
*/

// Gerenciar o botão de exibir e ocultar o nome do amigo
const buttonToggleFriendName = document.getElementById('displayFriendNameButton');
const friendNameParagraph = document.getElementById('friendName');
buttonToggleFriendName.addEventListener('click', () => {
    toggleFriendName();
});

function toggleFriendName() {
    if (visibleFriendName) {
        visibleFriendName = false;
        buttonToggleFriendName.innerText = 'Exibir Nome';
        friendNameParagraph.style.display = 'none';
        return
    }
    visibleFriendName = true;
    buttonToggleFriendName.innerText = 'Ocultar Nome';
    friendNameParagraph.style.display = 'block';
}

// Exibir o modal com o nome do amigo
function displayResult(friendName) {
    if (visibleFriendName) {
        // Reseta o estado de ocultar o nome do amigo
        buttonToggleFriendName.click();
    }

    // Mudar o <p> do modal para o nome do amigo
    friendNameParagraph.innerHTML = friendName;

    // Configurar e exibir o modal
    const containerFriendName = document.getElementById('containerFriendName');
    containerFriendName.style.display = 'flex';
    displayModal('withSubtitle', 'singleButton', {
        title: `Amigo sorteado:`,
        subtitle: `Certifique-se que nenhum xereta está olhando`
    });

    // Exibir a mensagem de fim de jogo
    const isLastFriend = friendsArray.length === sortedIds.length ? true : false;
    if (isLastFriend) {
        setupEndGameEnvironment();
    }
}

function setupEndGameEnvironment() {
    modalExitButton.addEventListener('click', async () => {
        // Esconde o container de nome do modal
        const containerFriendName = document.getElementById('containerFriendName');
        containerFriendName.style.display = 'none';

        // Apresenta a mensagem de fim de jogo
        await new Promise(resolve => setTimeout(resolve, 400));
        displayModal('withSubtitle', 'singleButton', {
            title: `Este era o último amigo`,
            subtitle: `Você pode sortear novamente ou iniciar um novo sorteio nos botões ao fim da página`
        });

        modalExitButton.addEventListener('click', () => {
            // Redefine o título
            updateTitle('drawEnd');

            // Configura o botão de iniciar novo sorteio
            const buttonCancelDraw = document.querySelector('.button-cancel-draw');
            buttonCancelDraw.removeAttribute('onclick');
            buttonCancelDraw.setAttribute('onclick', 'confirmRestart()');
            const buttonCancelDrawParagraph = buttonCancelDraw.querySelector('p');
            buttonCancelDrawParagraph.innerHTML = 'Novo Sorteio';

            // Configura o botão de reiniciar sorteio atual
            const buttonDraw = document.querySelector('.button-draw-action');
            buttonDraw.removeAttribute('onclick');
            buttonDraw.setAttribute('onclick', 'confirmDrawAgain()');
            const buttonDrawParagraph = buttonDraw.querySelector('p');
            buttonDrawParagraph.innerHTML = 'Repetir Sorteio';
        }, { once: true });
    }, { once: true });
}


/**
 * Lógica para gerenciar os processos
 *  de UI/UX após o sorteio
*/

// Gerencia os diálogos de confirmação
function manageConfirmations(functionToCall, message) {
    // Define a função do listener de confirmação
    async function handleConfirm() {
        backdrop.style.display = 'none';
        containerModal.style.display = 'none';
        if (message) {
            // Apresenta uma mensagem informativa
            await new Promise(resolve => setTimeout(resolve, 250));
            displayModal('noSubtitle', 'singleButton', {
                title: `${message}`,
            });
            manageModalButtonTemporaryEventListeners(functionToCall, 'singleButton')
        } else {
            functionToCall();
        }
    }

    manageModalButtonTemporaryEventListeners(handleConfirm);
}

// Gerencia a UX de iniciar novo sorteio
function confirmRestart() {
    displayModal('withSubtitle', 'twoButtons', {
        title: `Iniciar novo sorteio?`,
        subtitle: `Os nomes do sorteio atual serão perdidos`
    });

    manageConfirmations(restart);
}

// Gerencia a UX de reiniciar sorteio atual
function confirmDrawAgain() {
    displayModal('withSubtitle', 'twoButtons', {
        title: `Sortear novamente?`,
        subtitle: `Esta ação reinicia o sorteio atual`
    });

    manageConfirmations(drawAgain, 'Você pode modificar a lista de nomes antes de recomeçar');
}

// Reinicializa os botões inferiores após a confirmação
function resetDrawButtons() {
    // Reinicializa o botão de cancelar para
    // sua funcionalidade original
    toggleDisplay('buttonCancelDraw', 'disable');
    const buttonCancelDraw = document.querySelector('.button-cancel-draw');
    buttonCancelDraw.setAttribute('onclick', 'confirmDrawCancel()');
    const buttonCancelDrawParagraph = buttonCancelDraw.querySelector('p');
    buttonCancelDrawParagraph.innerHTML = 'Cancelar Sorteio';

    // Reinicializa o botão de Iniciar Sorteio para
    // sua funcionalidade original
    toggleDisplay('buttonDraw', 'disable');
    const buttonDraw = document.querySelector('.button-draw-action');
    buttonDraw.setAttribute('onclick', 'confirmDrawStart()');
    const buttonDrawParagraph = buttonDraw.querySelector('p');
    buttonDrawParagraph.innerHTML = 'Iniciar Sorteio';
}

// Limpa tudo para começar um novo sorteio
function restart() {
    // Reinicializa as variáveis globais
    friendsArray = [];
    sortedIds = [];
    currentFriendId = -1;
    scrollAtTop = true;
    listItensCurrentWidth = 0;
    if (visibleFriendName) {
        buttonToggleFriendName.click();
    }

    // Reinicializa o contador de amigos
    updateFriendCounter();

    // Reabilita o input e o botão de adicionar
    toggleDisplay('input', 'enable');
    toggleDisplay('addButton', 'enable');

    // Limpa a lista de amigos
    const listaAmigos = document.getElementById('listaAmigos');
    listaAmigos.innerHTML = '';
    manageUserEngagementFlow('clear');

    // Assegura o ocultamento do modal
    backdrop.style.display = 'none';
    containerModal.style.display = 'none';

    // Reinicializa os botões inferiores
    resetDrawButtons();
}

// Reinicia o sorteio atual
function drawAgain() {
    // Limpa o array do sorteio
    sortedIds = [];

    // Reabilita o input e o botão de adicionar
    toggleDisplay('input', 'enable');
    toggleDisplay('addButton', 'enable');

    // Reabilita os botões destrutivos e desabilita as setas
    toggleDisplay('buttonDestructive', 'enable');
    toggleDisplay('iconRightArrow', 'disable');

    // Reseta o estado de ocultar o nome do amigo no modal
    if (visibleFriendName) {
        buttonToggleFriendName.click();
    }

    // Redefine o título
    updateTitle('addingStart');

    // Assegura o ocultamento do modal
    backdrop.style.display = 'none';
    containerModal.style.display = 'none'

    // Reinicializa os botões inferiores
    resetDrawButtons();
}