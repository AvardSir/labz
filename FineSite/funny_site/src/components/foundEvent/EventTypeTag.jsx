export const EventTypeTag = ({ type, IdEvent, setFoundEvents }) => {
  const handleSearchButtonClick = async () => {
    try {
        
        console.log('::fasfs: ');
const response = await fetch(
    `/api/events/by-type?idTypeEvent=${(IdEvent)}`
);
console.log('IdEvent::: ', IdEvent);
      const result = await response.json();
      console.log(result);
      setFoundEvents(Array.isArray(result) ? result : []);
    } catch (error) {
      // console.error("Ошибка при поиске мероприятий:", error);
      setFoundEvents([]);
    }
  };

  return (
    <span className="cursor-pointer text-blue-600 hover:underline" onClick={handleSearchButtonClick}>
      🏷️ {type}
    </span>
  );
};
