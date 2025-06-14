import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { Footer } from "../Footer";
import AnecdoteCard from "./AnecdoteCard";

const ITEMS_PER_PAGE = 10;

export const FoundAnecdotes = ({ anecdotes, setFoundAnecdotes, fetchAnecdotes }) => {
    const navigate = useNavigate();
    const { loginData } = useContext(AuthContext);
    const [localAnecdotes, setLocalAnecdotes] = useState([]);

    // для чтения и установки query-параметра ?page=
    const [searchParams, setSearchParams] = useSearchParams();
    const pageFromUrl = parseInt(searchParams.get("page")) || 1;
    const [currentPage, setCurrentPage] = useState(pageFromUrl);

    const totalPages = Math.ceil(localAnecdotes.length / ITEMS_PER_PAGE);

    useEffect(() => {
        const fetchRatedAnecdotes = async () => {
            try {
                const res = await fetch(`/api/rated-anecdotes?IdUser=${loginData.IdUser}`);
                const rated = await res.json();
                const ratedMap = new Map(rated.map((r) => [r.IdAnecdote, r.IsPlus]));
                const updatedAnecdotes = anecdotes.map((a) => ({
                    ...a,
                    UserRating: ratedMap.get(a.IdAnecdote) ?? null,
                }));
                setLocalAnecdotes(updatedAnecdotes);
            } catch (error) {
                console.error("Ошибка при загрузке рейтингов:", error);
                setLocalAnecdotes(anecdotes);
            }
        };

        if (loginData?.IdUser && anecdotes.length > 0) fetchRatedAnecdotes();
        else setLocalAnecdotes(anecdotes);

        setCurrentPage(pageFromUrl); // при изменении данных сбрасываемся к текущей ?page=
    }, [anecdotes, loginData]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        setSearchParams({ page: page.toString() });
    };

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const visibleAnecdotes = localAnecdotes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <div className="found-anecdotes">
            <button onClick={fetchAnecdotes} className="action-btn">Сбросить поиск по типам</button>

            {Number(loginData.IdRights) === 2 && (
                <button onClick={() => navigate("/add-anecdote")} className="action-btn add-btn">
                    ✚ Добавить анекдот
                </button>
            )}

            {loginData?.IdUser && (
                <button onClick={() => navigate("/suggest-anecdote")} className="action-btn suggest-btn">
                    💡 Предложить анекдот
                </button>
            )}

            <h3 className="section-title">Найденные анекдоты (💡 Нажмите на анекдот, чтобы скопировать его текст)</h3>

            {visibleAnecdotes.length === 0 ? (
                <p className="empty-message">Ничего не найдено</p>
            ) : (
                <>
                    <ul className="anecdotes-list">
                        {visibleAnecdotes.map((anecdote) => (
                            <AnecdoteCard
                                key={anecdote.IdAnecdote}
                                anecdote={anecdote}
                                loginData={loginData}
                                navigate={navigate}
                                setFoundAnecdotes={setFoundAnecdotes}
                            />
                        ))}
                    </ul>

                    {/* Кнопки пагинации */}
                    <div className="pagination">
                        {currentPage > 1 && (
                            <button className="page-btn" onClick={() => handlePageChange(currentPage - 1)}>
                                ←
                            </button>
                        )}

                        {currentPage > 3 && (
                            <>
                                <button className="page-btn" onClick={() => handlePageChange(1)}>1</button>
                                {currentPage > 4 && <span className="dots">...</span>}
                            </>
                        )}

                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                            .filter(
                                (pageNum) =>
                                    pageNum >= currentPage - 2 && pageNum <= currentPage + 2
                            )
                            .map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => handlePageChange(pageNum)}
                                    className={`page-btn ${pageNum === currentPage ? "active" : ""}`}
                                >
                                    {pageNum}
                                </button>
                            ))}

                        {currentPage < totalPages - 2 && (
                            <>
                                {currentPage < totalPages - 3 && <span className="dots">...</span>}
                                <button className="page-btn" onClick={() => handlePageChange(totalPages)}>
                                    {totalPages}
                                </button>
                            </>
                        )}

                        {currentPage < totalPages && (
                            <button className="page-btn" onClick={() => handlePageChange(currentPage + 1)}>
                                →
                            </button>
                        )}
                    </div>
                </>
            )}

            <Footer />
        </div>
    );
};
