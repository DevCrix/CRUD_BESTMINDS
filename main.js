'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => document.getElementById('modal')
    .classList.remove('active')


const tempProduto = {
    nome: "Chuteira",
    codigo: "Ch001",
    descricao: "Chuteira de campo",
    preço: "300"
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
const saveProduto = () => {
    if (isValidFields()) {
        const produto = {
            nome: document.getElementById('nome').value,
            codigo: document.getElementById('codigo').value,
            descricao: document.getElementById('descricao').value,
            preco: document.getElementById('preco').value
        }
        createProduto(produto)
        clearFields()
        closeModal()
    }
}

//Eventos
document.getElementById('cadastrarProduto')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveProduto)