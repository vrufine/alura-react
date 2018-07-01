import React, { Component } from 'react'
import fetch from 'node-fetch'
import PubSub from 'pubsub-js'
import InputCustomizado from './InputCustomizado'

export class TabelaAutores extends Component {
  render() {
    return (
      <div>
        <table className="pure-table pure-table-horizontal pure-table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.autores.map((autor) => {
                return (
                  <tr key={autor.id}>
                    <td>{autor.id}</td>
                    <td>{autor.nome}</td>
                    <td>{autor.email}</td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export class FormularioAutor extends Component {
  constructor() {
    super()
    this.state = {
      nome: '',
      email: '',
      senha: ''
    }
    this.cadastrarAutor = this.cadastrarAutor.bind(this)
    this.setNome = this.setNome.bind(this)
    this.setEmail = this.setEmail.bind(this)
    this.setSenha = this.setSenha.bind(this)
  }
  cadastrarAutor(event) {
    event.preventDefault()
    fetch('http://localhost:8080/autores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome: this.state.nome,
        email: this.state.email,
        senha: this.state.senha
      })
    })
      .then(res => {
        return res.json()
      })
      .then(res => {
        PubSub.publish('novoAutorCadastrado', { novoAutor: res })
        this.setState({
          nome: "",
          email: "",
          senha: ""
        })
      })
      .catch(err => {
        alert('Erro! Verifique o console para mais detalhes.')
        console.log(err)
      })
  }

  setNome(event) {
    this.setState({ nome: event.target.value })
  }

  setEmail(event) {
    this.setState({ email: event.target.value })
  }

  setSenha(event) {
    this.setState({ senha: event.target.value })
  }
  render() {
    return (
      <form
        className="pure-form pure-form-stacked"
        onSubmit={this.cadastrarAutor}
        method="post"
      >
        <fieldset>
          <legend>Cadastro de autor</legend>

          <InputCustomizado
            value={this.state.nome}
            onChange={this.setNome}
            type="text"
            id="nome"
            placeholder="Nome"
          />
          <InputCustomizado
            value={this.state.email}
            onChange={this.setEmail}
            type="email"
            id="email"
            placeholder="E-mail"
          />
          <InputCustomizado
            value={this.state.senha}
            onChange={this.setSenha}
            type="password"
            id="senha"
            placeholder="Senha"
          />
          <button type="submit" className="pure-button pure-button-primary">Cadastrar</button>

        </fieldset>
      </form>
    )
  }
}

export default class AutorBox extends Component {
  constructor() {
    super()
    this.state = {
      autores: []
    }
    this.atualizarAutores = this.atualizarAutores.bind(this)
  }
  atualizarAutores() {
    fetch('http://localhost:8080/autores')
      .then(res => res.json())
      .then(res => {
        this.setState({ autores: res })
      })
  }
  componentDidMount() {
    this.atualizarAutores()
    PubSub.subscribe('novoAutorCadastrado', (topico, objeto) => {
      this.atualizarAutores()
    })
  }
  render() {
    return (
      <div>
        <FormularioAutor />
        <TabelaAutores autores={this.state.autores} />
      </div>
    )
  }
}
