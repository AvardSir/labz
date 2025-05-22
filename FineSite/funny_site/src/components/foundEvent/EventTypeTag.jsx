export const EventTypeTag = ({ type, EventTypeId, setFoundEvents }) => {
  const handleSearchButtonClick = async () => {
    try {
        
        
const response = await fetch(
    `/api/events/by-type?idTypeEvent=${(EventTypeId)}`
);

      const result = await response.json();
      
      setFoundEvents(Array.isArray(result) ? result : []);
    } catch (error) {
      
      setFoundEvents([]);
    }
  };

  return (
    <span className="cursor-pointer text-blue-600 hover:underline" onClick={handleSearchButtonClick}>
      🏷️ {type}
    </span>
  );
};
