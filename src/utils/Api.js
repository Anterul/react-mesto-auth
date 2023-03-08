class Api {
  constructor({baseUrl, headers}) {
    this._baseUrl = baseUrl;
    this.authorization = headers.authorization;
  }
  
  _getResponseData(res) {
    if (!res.ok) {
      return Promise.reject(`Ошибка: ${res.status}`); 
    }
    return res.json();
  }

  getUserInfo(url) {
    return fetch(url, {
      method: 'GET',
      headers: {
        authorization: this.authorization,
      }
    })
    .then(this._getResponseData)
  }

  getInitialCards() {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'GET',
      headers: {
        authorization: this.authorization,
      }
    })
    .then(this._getResponseData)
  }

  submitProfileData(name, about) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: {
        authorization: this.authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
    .then(this._getResponseData)
  }

  deleteCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: this.authorization,
      },
    })
    .then(this._getResponseData)
  }

  addNewCard(name, link) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: {
        authorization: this.authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        link: link
      })
    })
    .then(this._getResponseData)
  }

  likeCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'PUT',
      headers: {
        authorization: this.authorization,
      },
    })
    .then(this._getResponseData)
  }

  dislikeCard(id) {
    return fetch(`${this._baseUrl}/cards/${id}/likes`, {
      method: 'DELETE',
      headers: {
        authorization: this.authorization,
      },
    })
    .then(this._getResponseData)
  }

  updateAvatar(avatarUrl) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this.authorization,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: avatarUrl
      })
    })
    .then(this._getResponseData)
  }

  changeLikeCardStatus(id, isLiked) {
    if (isLiked) {
      return this.likeCard(id);
    } else {
      return this.dislikeCard(id)
    }
  }

}

const api = new Api({
  baseUrl: `https://mesto.nomoreparties.co/v1/cohort-57`,
  headers: {
    authorization: 'cc8211c2-a478-4e6c-819c-a7ec6fb1096c'
  }
});

export default api;