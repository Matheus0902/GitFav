export class GithubUsers {
  static search(user) {
    const URL = `https://api.github.com/users/${user}`

    return fetch(URL)
    .then(data => data.json())
    .then(({ login, name, public_repos, followers}) => ({
      
      login,
      name,
      public_repos,
      followers
      
    }))
  }
}