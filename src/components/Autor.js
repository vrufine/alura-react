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
  alterarStateDoCampo(campo, event) {
    this.setState({ [campo]: event.target.value })
  }
  render() {
    return (
      <form
        className="pure-form pure-form-stacked"
        onSubmit={this.cadastrarAutor}
        method="post"
      >
        <fieldset>
          <InputCustomizado
            value={this.state.nome}
            onChange={this.alterarStateDoCampo.bind(this, 'nome')}
            type="text"
            id="nome"
            placeholder="Nome"
          />
          <InputCustomizado
            value={this.state.email}
            onChange={this.alterarStateDoCampo.bind(this, 'email')}
            type="email"
            id="email"
            placeholder="E-mail"
          />
          <InputCustomizado
            value={this.state.senha}
            onChange={this.alterarStateDoCampo.bind(this, 'senha')}
            type="password"
            id="senha"
            placeholder="Senha"
          />
          <button type="submit" className="pure-button pure-button-primary ">Cadastrar</button>
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
  componentWillMount() {
    this.atualizarAutores()
    PubSub.subscribe('novoAutorCadastrado', (topico, objeto) => {
      this.atualizarAutores()
    })
  }
  render() {
    return (
      <div>
        <div className="header">
          <h1>Cadastro de autores</h1>
        </div>
        <div id="content" className="content">
          <FormularioAutor />
          <TabelaAutores autores={this.state.autores} />
        </div>
      </div>
    )
  }
}
