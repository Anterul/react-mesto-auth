import { useEffect, useState } from "react";

function Login(props) {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!password || !email) {
      return;
    }
    props.onSignIn(password, email);
  }

  useEffect(() => {
    setPassword("");
    setEmail("");
  }, []);

  return (
    <div className="auth">
      <h2 className="auth__title">Вход</h2>
      <form className="auth__form" onSubmit={handleSubmit}>
        <input
          className="auth__input"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          type="email"
          name="email"
          id="email"
          required
        />
        <input
          className="auth__input"
          value={password}
          onChange={handlePasswordChange}
          placeholder="Пароль"
          type="password"
          name="password"
          id="password"
          required
        />
        <button className="auth__submit-button" type="submit">
          Войти
        </button>
      </form>
    </div>
  );
}

export default Login;
