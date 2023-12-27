'use strict'

//Função para abrir o modal
const openModal = () => document.getElementById('modal')
    .classList.add('active')

//Função para fechar o modal e limpar os campos que são preenchidos
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

//DELETE
const deleteProduto = (index) => {
    const dbProduto = readProduto()
    dbProduto.splice(index, 1)
    setLocalStorage(dbProduto)
}

//Interação com o usuario

//Função para limpar os campos do formulário
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

//Função para salvar um produto
const saveProduto = () => {
    if (isValidFields()) {
        const produto = {
            nome: document.getElementById('nome').value,
            codigo: document.getElementById('codigo').value,
            descricao: document.getElementById('descricao').value,
            preco: document.getElementById('preco').value
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            createProduto(produto)
            updateTable()
            closeModal()
        } else {
            updateProduto(index, produto)
            updateTable()
            closeModal()
        }
    }
}

//Função para crirar uma nova linha na tabela
const createRow = (produto, index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
    <td>${produto.nome}</td>
    <td>${produto.codigo}</td>
    <td>${produto.descricao}</td>
    <td>${produto.preco}</td>
    <td>
    <button type="button" class="button green" id="edit-${index}">Editar</button>
    <button type="button" class="button red" id="delete-${index}">Excluir</button>
    </td>
    `
    document.querySelector('#tableProduto>tbody').appendChild(newRow)
}

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
    produto.index = index
    fillFields(produto)
    openModal()
}

//Função para edutar ou excluir um produto com base no botão clicado
const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editProduto(index)
        } else {
            const produto = readProduto()[index]
            const response = confirm(`Deseja excluir o produto ${produto.nome}`)
            if (response) {
                deleteProduto(index)
                updateTable()
            }
        }
    }
}

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