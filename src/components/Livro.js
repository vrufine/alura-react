import React, { Component } from 'react'
import PubSub from 'pubsub-js'
import fetch from 'node-fetch'
import InputCustomizado from './InputCustomizado';

export class TabelaLivro extends Component {
  render = () => (
    <div>
      <table className="pure-table">
        <thead>
          <tr>
            <td>Título</td>
            <td>Autor</td>
          </tr>
        </thead>
        <tbody>
          {
            this.props.livros.map(livro => {
              return (
                <tr key={livro.id}>
                  <td>{livro.titulo}</td>
                  <td>{livro.autor}</td>
                </tr>
              )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export class FormularioLivros extends Component {
  constructor() {
    super()
    this.state = {
      titulo: '',
      autor: '',
      autores: []
    }
    this.setTitulo = this.setTitulo.bind(this)
    this.setAutor = this.setAutor.bind(this)
    this.cadastrarLivro = this.cadastrarLivro.bind(this)
    this.buscarAutores = this.buscarAutores.bind(this)
  }
  setTitulo = (event) => {
    this.setState({ titulo: event.target.value })
  }
  setAutor = (event) => {
    this.setState({ autor: event.target.value })
  }
  buscarAutores = () => {
    fetch('http://localhost:8080/autores')
      .then(res => res.json())
      .then(res => {
        this.setState({ autores: res })
      })
  }
  cadastrarLivro = (event) => {
    event.preventDefault()
    fetch('http://localhost:8080/livros', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    })
    .then(res => {
      PubSub.publish('novoLivroCadastrado', res)
      this.setState({ titulo: '', autor: '' })
    })
    .catch(err => {
      alert('Erro ao cadastrar o livro')
      console.log(err)
    })
  }
  componentDidMount() {
    this.buscarAutores()
  }
  render = () => (
    <form
      className="pure-form pure-form-stacked"
      onSubmit={this.cadastrarLivro}
      method="post"
    >
      <InputCustomizado
        value={this.state.titulo}
        onChange={this.setTitulo}
        type="text"
        id="titulo"
        placeholder="Título"
      />
      <select name="autor" id="autor" placeholder="Selecione o autor" value={this.state.autor} onChange={this.setAutor}>
        <option value="">Selecione um autor</option>
        {
          this.state.autores.map(autor => {
            return (
              <option key={autor.id} value={autor.nome}>{autor.nome}</option>
            )
          })
        }
      </select>
      <button type="submit" className="pure-button pure-button-primary" onClick={this.cadastrarLivro}>Cadastrar livro</button>
    </form>
  )
}

export default class LivroBox extends Component {
  constructor() {
    super()
    this.state = {
      livros: []
    }
    this.buscarLivros = this.buscarLivros.bind(this)
  }
  buscarLivros = () => {
    fetch('http://localhost:8080/livros')
      .then(res => res.json())
      .then(res => {
        this.setState({ livros: res })
      })
      .catch(err => {
        alert('Erro ao cadastrar o livro! Verifique o console.')
        console.log(err)
      })
  }
  componentDidMount() {
    this.buscarLivros()
    PubSub.subscribe('novoLivroCadastrado', () => {
      this.buscarLivros()
    })
  }
  render = () => (
    <div>
      <div className="header">
        <h1>Cadastro de livros</h1>
      </div>
      <div id="content" className="content">
        <FormularioLivros/>
        <hr/>
        <TabelaLivro livros={this.state.livros} />
      </div>
    </div>
  )
}