import PopupWithForm from './PopupWithForm';

function DeleteCardPopup(props) {
  return (
    <PopupWithForm
      name="delete-card"
      isOpen={props.isOpen}
      onClose={props.onClose}
      title="Вы уверены ?"
      onSubmit={props.onSubmit}
      buttonText="Да"
    >
    </PopupWithForm>
  );
}

export default DeleteCardPopup;