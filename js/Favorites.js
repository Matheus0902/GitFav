import { GithubUsers } from "./GithubUsers.js"

export class Favorites {
  constructor(root){
    this.root = document.querySelector(root)

    this.tbody = document.querySelector('table tbody')
    this.load()
  }

  load() {
    this.users = JSON.parse(localStorage.getItem('@Git-fav:')) || []
  }

  save() {
    localStorage.setItem('@Git-fav:' , JSON.stringify(this.users))
  }

  async add(username) {

    try {
      const userExists = this.users.find(entry => entry.login.toLowerCase() === username.toLowerCase())

      if(userExists) {
        throw new Error('Este usuário já existe')
      }

      const user = await GithubUsers.search(username)

      if(user.login === undefined) {
        throw new Error("Usuário não encontrado!")
      }
  
      this.users = [user, ...this.users]
      this.save()
      this.update()
      
    } catch (error) {
        alert(error.message)
    } finally {
      
      this.root.querySelector('#search input').value =''
    }

  }

  delete(user) {

    const removingUser = this.users
    .filter(currentUser => currentUser.login !== user.login)

    this.users = removingUser
    this.update()
    this.save()
  }

}

export class FavoritesView extends Favorites{
  constructor(root) {
    super(root)

    this.update()
    this.onAdd()
  }

  update() {

    this.removeAllRows()

    this.users.forEach(user => {
      
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `imagem de ${user.login}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {

        const isOk = confirm('Tem certeza que deseja remover este usuário?')

        if(isOk) {
          this.delete(user)
        }
      }
      
      this.tbody.append(row)
    })

  }

  onAdd() {
    const addButton = this.root.querySelector('#search button')

    addButton.addEventListener('click', () => {
      const { value } = this.root.querySelector('#search input')

      this.add(value)
    })
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
        <a href="https://github.com/maykbrito" target="_blank">
          <p>Mayk Brito</p>
          <span>/maykbrito</span>
        </a>
      </td>
      <td class="repositories">
        76
      </td>
      <td class="followers">
        9589
      </td>
      <td>
        <button class="remove">Remover</button>
      </td>
    `

    return tr
  }

  removeAllRows() {
    this.tbody.querySelectorAll('tr')
    .forEach(tr => {
      tr.remove()
    })
  }
}