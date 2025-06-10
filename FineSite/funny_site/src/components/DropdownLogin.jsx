import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export const DropdownLogin = () => {
    const { isLoggedIn, login, logout, loginData } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [credentials, setCredentials] = useState({ login: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Сбрасываем dropdown при смене isLoggedIn (логин/логаут)
    useEffect(() => {
        setIsOpen(false);
        setError("");
        setCredentials({ login: "", password: "" });
    }, [isLoggedIn]);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
        setError("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("/api/users/users", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });

            const result = await response.json();
            const user = result.find(
                (user) => user.Name === credentials.login && user.Password === credentials.password
            );

            if (user) {
                login(credentials.login, credentials.password, user.IdRights);
                navigate("/");
                setIsOpen(false);
            } else {
                setError("Неверный логин или пароль");
            }
        } catch (err) {
            console.error("Ошибка авторизации:", err);
            setError("Ошибка связи с сервером");
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
        setIsOpen(false);
    };

    return (
        <div className="dropdown-login dropdown-container">
            {isLoggedIn ? (
                <>
                    <button onClick={toggleDropdown} className="dropdown-toggle">
                        {loginData.login} ▼
                    </button>
                    {isOpen && (
                        <div className="dropdown-menu">
                            <Link to="/personal_cabinet" onClick={() => setIsOpen(false)} className="dropdown-item">
                                Профиль
                            </Link>
                            <Link to="/FavoriteAnecdotesList" onClick={() => setIsOpen(false)} className="dropdown-item">
                                Избранное
                            </Link>
                            {parseInt(loginData.IdRights) === 2 && (
                                <Link to="/analytics" onClick={() => setIsOpen(false)} className="dropdown-item">
                                    Аналитика
                                </Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="dropdown-toggle"
                                style={{
                                    textDecoration: "none",
                                    color: "inherit",
                                    marginLeft: "1.5rem",
                                    transition: "opacity 0.3s ease",
                                }}
                            >
                                Выйти
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <>
                    <button onClick={toggleDropdown} className="dropdown-toggle">
                        Войти ▼
                    </button>
                    {isOpen && (
                        <div className="dropdown-menu">
                            <form onSubmit={handleSubmit}>
                                <input
                                    type="text"
                                    name="login"
                                    placeholder="Логин"
                                    value={credentials.login}
                                    onChange={handleChange}
                                />
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Пароль"
                                    value={credentials.password}
                                    onChange={handleChange}
                                />
                                 <button type="submit" className="dropdown-button">Войти</button>

                            </form>
                            <p>
                                <a href="/registration">Регистрация</a>
                            </p>
                            {error && <p className="error-message">{error}</p>}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
