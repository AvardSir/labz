import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";
import { Header } from "./Header";

export const FavoriteAnecdotesList = () => {
    const { loginData } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    // Вверху компонента
    const fetchFavorites = async () => {
        if (!loginData?.IdUser) {
            setFavorites([]);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const res = await axios.get(`/api/favorites/${loginData.IdUser}`);
            setFavorites(res.data);
            setError(null);
        } catch (err) {
            setError("Ошибка загрузки избранных анекдотов");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, [loginData]);

    const handleRemoveFavorite = async (IdAnecdote) => {
        try {
            await axios.delete(`/api/favorites/${loginData.IdUser}/${IdAnecdote}`);
            // После удаления обновляем список
            fetchFavorites();
        } catch (err) {
            alert("Ошибка при удалении из избранного");
            console.error(err);
        }
    };

    if (loading) return <p>Загрузка избранных анекдотов...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (favorites.length === 0) return <p>У вас пока нет избранных анекдотов.</p>;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => alert("Текст скопирован в буфер обмена"))
            .catch(() => alert("Ошибка копирования текста"));
    };

    return (
        <div className="favorite-anecdotes" style={{ maxWidth: 600, margin: "auto" }}>
            <Header />
            <h3>Личный архив избранных анекдотов</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
                {favorites.map((anecdote) => (
                    <li
                        key={anecdote.IdAnecdote}
                        className="card"
                        style={{
                            border: "1px solid #ccc",
                            padding: 10,
                            marginBottom: 12,
                            borderRadius: 6,
                            cursor: "pointer",
                        }}
                        title="Нажмите, чтобы скопировать текст"
                        onClick={() => handleCopy(anecdote.Text)}
                    >
                        {(anecdote.Text ?? '').split("\n").map((line, idx) => (
                            <React.Fragment key={`${anecdote.IdAnecdote}-${idx}`}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))}
                        <div style={{ marginTop: 8, fontSize: "0.85em", color: "white" }}>
                            <span>⭐ {anecdote.Rate || 0}</span>{" "}
                            <span>👤 {anecdote.UserName || "неизвестно"}</span>{" "}
                            <span>📅 {new Date(anecdote.Date).toLocaleDateString()}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // чтобы не срабатывал клик по карточке (копирование)
                                    if (window.confirm("Удалить из избранного?")) {
                                        handleRemoveFavorite(anecdote.IdAnecdote);
                                    }
                                }}
                                style={{ marginLeft: 10, backgroundColor: "#f44336", color: "white", border: "none", borderRadius: 4, padding: "4px 8px", cursor: "pointer" }}
                            >
                                Удалить из избранного
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
