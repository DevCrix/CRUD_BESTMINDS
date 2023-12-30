'use strict'

//Função para abrir a tabela
const openModal = () => document.getElementById('modal')
    .classList.add('active')

//Função para fechar a tabela e limpar os campos que são preenchidos
const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

//Função para obter e definir os dados do LocalStorage
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_produto')) ?? []
const setLocalStorage = (dbProduto) => localStorage.setItem("db_produto", JSON.stringify(dbProduto))

//CRUD - Create Read Update Delete

//CREATE
const createProduto = (produto) => {
    const dbProduto = getLocalStorage()
    dbProduto.push(produto)
    setLocalStorage(dbProduto)
}

//READ
const readProduto = () => getLocalStorage()

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//UPDATE
const updateProduto = (index, produto) => {
    const dbProduto = readProduto()
    dbProduto[index] = produto
    setLocalStorage(dbProduto)
}

// DELETE
const deleteProduto = (index) => {
    try {
        const dbProduto = readProduto();
        dbProduto.splice(index, 1);
        setLocalStorage(dbProduto);
        console.log("Produto deletado com sucesso!");
        updateTable(); // Adiciona essa linha para atualizar a tabela após a exclusão.
    } catch (error) {
        console.error("Erro ao deletar o produto:", error);
    }
};


//Interação com o usuario

//Função para limpar os campos do formulário
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

function formatarValorBRL(valor) {
    return valor.toLocaleString('pt-BR'), { style: 'currency', currency: 'BRL' };
  }

// Função para salvar um produto
const saveProduto = (event) => {
    event.preventDefault(); // Impede o envio padrão do formulário
    let valorFormatado1 = document.getElementById('preco').value;
    let num = 'R$ ' + Number(valorFormatado1).toLocaleString('pt-BR').replace(".", ",");
    let valorFormatado2 = num;
    let codigo ='CÓD ' +  document.getElementById('codigo').value;

    try {
        if (isValidFields()) {
            const produto = {
                nome: document.getElementById('nome').value,
                codigo: codigo,
                descricao: document.getElementById('descricao').value,
                preco: valorFormatado2
            };

            const index = document.getElementById('nome').dataset.index;
            if (index == 'new') {
                createProduto(produto);
                updateTable();
                closeModal();
                Toastify({
                    text: "Produto salvo com sucesso!",
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",
                    backgroundColor: "green",
                }).showToast();
            } else {
                updateProduto(index, produto);
                updateTable();
                closeModal();
                Toastify({
                    text: "Produto editado com sucesso!",
                    duration: 3000,
                    gravity: "bottom",
                    position: "right",
                    backgroundColor: "green",
                }).showToast();
            }
        }
    } catch (error) {
        console.error("Erro ao salvar o produto:", error);
        Toastify({
            text: "Erro ao salvar o produto. Por favor, tente novamente.",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            backgroundColor: "red",
        }).showToast();
    }
};

// Evento de envio do formulário
document.getElementById('form')
    .addEventListener('submit', saveProduto);


// Função para criar uma nova linha na tabela
const createRow = (produto, index) => {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${produto.nome}</td>
        <td>${produto.codigo}</td>
        <td>${produto.descricao}</td>
        <td>${produto.preco}</td>
        <td>
            <button type="button" class="button green" data-index="${index}">Editar</button>
            <button type="button" class="button red" data-index="${index}">Excluir</button>
        </td>
    `;

    // Adicione os eventos de clique diretamente às linhas, em vez de usar o evento delegado
    newRow.querySelector('.button.green').addEventListener('click', () => editProduto(index));
    newRow.querySelector('.button.red').addEventListener('click', () => confirmDelete(index));

    document.querySelector('#tableProduto>tbody').appendChild(newRow);
};


//Função para limpar todas as linhas da tabela
const clearTable = () => {
    const rows = document.querySelectorAll('#tableProduto>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

//Função para atualizar a tabela
const updateTable = () => {
    const dbProduto = readProduto()
    clearTable()
    dbProduto.forEach(createRow)
}

//Função para preencher os campos do formulário com os dados de um produto
const fillFields = (produto) => {
    document.getElementById('nome').value = produto.nome
    document.getElementById('codigo').value = produto.codigo
    document.getElementById('descricao').value = produto.descricao
    document.getElementById('preco').value = produto.preco
    document.getElementById('nome').dataset.index = produto.index
}

//Função para editar um produto
const editProduto = (index) => {
    const produto = readProduto()[index]
    fillFields(produto)
    document.getElementById('nome').dataset.index = index
    openModal()
}


//Função para editar ou excluir um produto com base no botão clicado
const editDelete = (event) => {
    if (event.target.classList.contains('button')) {
        const index = event.target.dataset.index;

        if (!isNaN(index)) {
            const parsedIndex = parseInt(index);

            const produtos = readProduto();
            const produto = produtos[parsedIndex];

            if (produto) {
                if (event.target.classList.contains('green')) {
                    editProduto(parsedIndex);
                } else if (event.target.classList.contains('red')) {
                    const response = confirm(`Deseja excluir o produto ${produto.nome}`);
                    if (response) {
                        deleteProduto(parsedIndex);
                        updateTable();
                    }
                }
            }
        } else {
            console.error("Índice de produto inválido:", index);
        }
    }
};




// Função para confirmar a exclusão
const confirmDelete = (index) => {
    const produtos = readProduto();

    if (!isNaN(index) && index >= 0 && index < produtos.length) {
        const produto = produtos[index];
        const response = confirm(`Deseja excluir o produto ${produto.nome}`);

        if (response) {
            deleteProduto(index);
            updateTable();
        }
    } else {
        console.error("Índice de produto inválido:", index);
    }
};

updateTable()


//Eventos
document.getElementById('cadastrarProduto')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveProduto)

document.querySelector('#tableProduto>tbody')
    .addEventListener('click', editDelete)