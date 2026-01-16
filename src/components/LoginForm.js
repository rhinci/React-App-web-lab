import React from 'react';

function LoginForm() {
  return (
    <div>
      <h2>Вход в систему</h2>
      <form>
        <input type="text" placeholder="Логин" />
        <input type="password" placeholder="Пароль" />
        <button type="submit">Войти</button>
      </form>
    </div>
  );
}

export default LoginForm;