'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_produto')) ?? []
const setLocalStorage = (dbProduto) => localStorage.setItem("db_produto", JSON.stringify(dbProduto))

//CRUD - create update delete

//DELETE
const deleteProduto = (index) => {
    const dbProduto = readProduto()
    dbProduto.splice(index, 1)
    setLocalStorage(dbProduto)
}

//UPDATE
const updateProduto = (index, produto) => {
    const dbProduto = readProduto()
    dbProduto[index] = produto
    setLocalStorage(dbProduto)
}

//READ
const readProduto = () => getLocalStorage()

//CREATE
const createProduto = (produto) => {
    const dbProduto = getLocalStorage()
    dbProduto.push(produto)
    setLocalStorage(dbProduto)
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

//Interação com o usuario

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

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

const clearTable = () => {
    const rows = document.querySelectorAll('#tableProduto>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbProduto = readProduto()
    clearTable()
    dbProduto.forEach(createRow)
}

const fillFields = (produto) => {
    document.getElementById('nome').value = produto.nome
    document.getElementById('codigo').value = produto.codigo
    document.getElementById('descricao').value = produto.descricao
    document.getElementById('preco').value = produto.preco
    document.getElementById('nome').dataset.index = produto.index
}

const editProduto = (index) => {
    const produto = readProduto()[index]
    produto.index = index
    fillFields(produto)
    openModal()
}

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