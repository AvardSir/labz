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
    <span
    className="relative cursor-pointer text-blue-600 hover:underline"
    onClick={handleSearchButtonClick}
>
    🏷️ <u>{type}</u>
    <span className="absolute left-full ml-2 opacity-0 hover:opacity-100 transition-opacity duration-200">
        
    </span>
</span>


  );
};
