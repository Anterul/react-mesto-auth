function PopupWithForm(props) {
  return (
    <div className={`popup popup_name_${props.name} ${props.isOpen ? `popup_opened` : ""}`}>
      <div className="popup__container popup__container_type_form">
        <button className="popup__close-button" onClick={props.onClose} type="button"></button>
        <h2 className="popup__title popup__title_type_form">{props.title}</h2>
        <form
          className="popup__form"
          name={props.name}
          id={props.name}
          onSubmit={props.onSubmit}
        >
          {props.children}
          <button className="popup__save-button" type="submit">{props.buttonText}</button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;