export const AnecdoteTypeTag = ({ type, typeId, onSearch, setFoundAnecdotes }) => {
    const  handleClick = async() => {
        console.log(setFoundAnecdotes)  
        // const { anecdote } = typeId;
        try {
            const response = await fetch(
                `/api/anecdotes/by-type?idTypeAnecdote=${encodeURIComponent(typeId)}`
            );
            const result = await response.json();
            setFoundAnecdotes(Array.isArray(result) ? result : []);
            // handleSearchAnecdotes(); // Вызываем handleSearchAnecdotes у родителя
        } catch (error) {
            console.error("Ошибка при поиске анекдотов:", error);
            setFoundAnecdotes([]);
        }
    };

    return (
        <span
    onClick={handleClick}
    style={{ cursor: "pointer" }}
    title="Кликните для фильтрации по этому типу"
    className="anecdote-type-tag"
>
    🏷️<u>{type}</u>
</span>

    );
};