import React, { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";
import { Header } from "./Header";

const PAGE_SIZE = 10;

export const FavoriteAnecdotesList = () => {
    const { loginData } = useContext(AuthContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchFavorites = useCallback(async (pageNum = 1) => {
        if (!loginData?.IdUser) {
            setFavorites([]);
            setLoading(false);
            setHasMore(false);
            return;
        }
        try {
            if (pageNum === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }
            const res = await axios.get(`/api/favorites/${loginData.IdUser}`, {
                params: {
                    page: pageNum,
                    limit: PAGE_SIZE,
                },
            });
            if (res.data.length < PAGE_SIZE) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }
            if (pageNum === 1) {
                setFavorites(res.data);
            } else {
                setFavorites(prev => [...prev, ...res.data]);
            }
            setError(null);
        } catch (err) {
            setError("Ошибка загрузки избранных анекдотов");
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [loginData]);

    useEffect(() => {
        setPage(1);
        fetchFavorites(1);
    }, [loginData, fetchFavorites]);

    useEffect(() => {
        const handleScroll = () => {
            if (loadingMore || loading || !hasMore) return;

            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= docHeight - 150) {
                setPage(prev => prev + 1);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loadingMore, loading, hasMore]);

    useEffect(() => {
        if (page === 1) return; // Уже загрузили первую страницу
        fetchFavorites(page);
    }, [page, fetchFavorites]);

    const handleRemoveFavorite = async (IdAnecdote) => {
        try {
            await axios.delete(`/api/favorites/${loginData.IdUser}/${IdAnecdote}`);
            // Обновляем список, можно просто перезагрузить первую страницу
            setPage(1);
            fetchFavorites(1);
        } catch (err) {
            alert("Ошибка при удалении из избранного");
            console.error(err);
        }
    };

    if (loading && page === 1) return <p>Загрузка избранных анекдотов...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (favorites.length === 0) return <p><Header />У вас пока нет избранных анекдотов.</p>;

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => alert("Текст скопирован в буфер обмена"))
            .catch(() => alert("Ошибка копирования текста"));
    };

    return (
        <div className="favorite-anecdotes" style={{ maxWidth: 600, margin: "auto" }}>
            <Header/>
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
                                    e.stopPropagation();
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
            {loadingMore && <p>Загрузка...</p>}
            {!hasMore && <p>Больше анекдотов нет.</p>}
        </div>
    );
};
