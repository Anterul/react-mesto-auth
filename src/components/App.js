import { useEffect, useState } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import api from '../utils/Api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';
import DeleteCardPopup from './DeleteCardPopup';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import ProtectedRoute from './ProtectedRoute';
import { AppContext } from '../contexts/AppContext';
import * as Auth from '../utils/Auth';
import InfoTooltip from './InfoTooltip';

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState({
    userName: '',
    userDescription: '',
    userAvatar: '',
    _id: ''
  });
  const [cards, setCards] = useState([]);
  const [buttonText, setButtonText] = useState('Сохранить');
  const [addPlacePopupButtonText, setAddPlacePopupButtonText] = useState('Создать');
  const [isDeleteCardPopupOpen, setIsDeleteCardPopupOpen] = useState(false);
  const [isLoggedIn , setIsLogedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
 
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleImagePopup() {
    setIsImagePopupOpen(true);
  }

  function handleDeleteButtonClick() {
    setIsDeleteCardPopupOpen(true);
  }

  function handleLogin() {
    setIsLogedIn(true);
  }
  
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsImagePopupOpen(false);
    setIsDeleteCardPopupOpen(false);
    setIsInfoTooltipOpen(false);
  }

  function handleInfoTooltip() {
    setIsInfoTooltipOpen(true);
  }

  function handleSignUpStatus() {
    setIsSignUp(true);
  }

  useEffect(() => {
    Promise.all([
      api.getUserInfo('https://nomoreparties.co/v1/cohort-57/users/me'),
      api.getInitialCards()
    ])
    .then(([userData, cardsData])=>{
      setCurrentUser({
        userName: userData.name,
        userDescription: userData.about,
        userAvatar: userData.avatar,
        _id: userData._id
      });
      setCards(cardsData);
    })
    .catch((error) => {
      console.log(`Ошибка: ${error}`);
    });

  }, [])

  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    
    api.changeLikeCardStatus(card._id, !isLiked)
    .then((newCard) => {
      setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
    })
    .catch((error) => {
      console.log(`Ошибка: ${error}`);
    });
  }

  function handleCardDelete(card) {
    api.deleteCard(card._id)
    .then((newCard) => {
      setCards((state) => state.filter((c) => c._id !== card._id));
      closeAllPopups();
    })
    .catch((error) => {
      console.log(`Ошибка: ${error}`);
    });
  }

  function handleUpdateUser({name, about}) {
    setButtonText('Сохранение...');
    api.submitProfileData(name, about)
    .then((data) => {
      setCurrentUser({
        userName: data.name,
        userDescription: data.about,
        userAvatar: data.avatar,
        _id: data._id
      })
      closeAllPopups();
    })
    .catch((error) => {
      console.log(`Ошибка: ${error}`);
    })
    .finally(() => {
      setButtonText('Сохранить');
    });
  }

  function handleUpdateAvatar({avatar}) {
    setButtonText('Сохранение...');
    api.updateAvatar(avatar)
    .then((data) => {
      setCurrentUser({
        userName: data.name,
        userDescription: data.about,
        userAvatar: data.avatar,
        _id: data._id
      })
      closeAllPopups();
    })
    .catch((error) => {
      console.log(`Ошибка: ${error}`);
    })
    .finally(() => {
      setButtonText('Сохранить');
    });
  }

  function handleAddPlaceSubmit({name, link}) {
    setAddPlacePopupButtonText('Сохранение...');
    api.addNewCard(name, link)
    .then((newCard) => {
      setCards([newCard, ...cards]);
      closeAllPopups();
    })
    .catch((error) => {
      console.log(`Ошибка: ${error}`);
    })
    .finally(() => {
      setAddPlacePopupButtonText('Создать');
    });
  }

  const navigate = useNavigate();

  function tokenCheck() {
    const jwt = localStorage.getItem('jwt');
    if (jwt) {
      Auth.getContent(jwt)
      .then((res) => {
        if (res) {
          setEmail(res.data.email);
          setIsLogedIn(true);
          navigate("/", {replace: true});
        }
      });
    }
  }

  const location = useLocation();

  useEffect(() => {
    if (!isLoggedIn && location.pathname !== '/sign-up') {
      navigate('/sign-in', {replace: true});
    }
  }, [location.pathname])

  useEffect(() => {
    tokenCheck();
  }, [isLoggedIn])
  

  function signOut() {
    localStorage.removeItem('jwt');
    navigate('/sign-in', {replace: true});
    setIsLogedIn(false);
  }

  function handleRegister(password, email) {
    Auth.register(password, email)
    .then((res) => {
      handleSignUpStatus();
      handleInfoTooltip();
      navigate('/sign-in', {replace: true})
    })
    .catch((error) => {
      console.log(error);
      handleInfoTooltip();
      setIsSignUp(false);
    })
  }
  
  function handleSignIn(password, email) {
    Auth.authorize(password, email)
    .then((data) => {
      if (data.token) {
        handleLogin();
        localStorage.setItem('jwt', data.token)
        setEmail(data.email);
        navigate('/', {replace: true});
      }
    })
    .catch(err => console.log(err));
  }


  return (
    <CurrentUserContext.Provider value={currentUser}>
      <AppContext.Provider value={{state: isLoggedIn, handleLogin: handleLogin}}>
        <div className="page">
          <div className="page-content">
            <Header
              email={email}
              onSignOut={signOut}
            />
            <Routes>
              <Route path='/' element={
                <ProtectedRoute
                  exact
                  element={Main}
                  onEditAvatar={handleEditAvatarClick}
                  onEditProfile={handleEditProfileClick}
                  onAddPlace={handleAddPlaceClick}
                  onCardClick={setSelectedCard}
                  handleImagePopup={handleImagePopup}
                  onCardLike={handleCardLike}
                  cards={cards}
                  onCardDelete={handleCardDelete}
                />}
              />
              <Route path='/sign-up' element={<Register onSignUp={handleRegister}/>}/>
              <Route path='/sign-in' element={<Login onSignIn={handleSignIn}/>} />
            </Routes>
            {isLoggedIn && <Footer />}
            <EditProfilePopup
              isOpen={isEditProfilePopupOpen}
              onClose={closeAllPopups}
              onUpdateUser={handleUpdateUser}
              buttonText={buttonText}
            />
            <AddPlacePopup
              isOpen={isAddPlacePopupOpen}
              onClose={closeAllPopups}
              onAddPlace={handleAddPlaceSubmit}
              buttonText={addPlacePopupButtonText}
            />
            <DeleteCardPopup
              isOpen={isDeleteCardPopupOpen}
              onClose={closeAllPopups}
              onSubmit={handleCardDelete}
            />
            <EditAvatarPopup
              isOpen={isEditAvatarPopupOpen}
              onClose={closeAllPopups}
              onUpdateAvatar={handleUpdateAvatar}
              buttonText={buttonText}
            />
            <ImagePopup
              card={selectedCard}
              isOpen={isImagePopupOpen}
              onClose={closeAllPopups}
            />
            <InfoTooltip
              isOpen={isInfoTooltipOpen}
              isSignUp={isSignUp}
              onClose={closeAllPopups}
            />
          </div>
        </div>
      </AppContext.Provider>
    </CurrentUserContext.Provider>
  );
}

export default App;
