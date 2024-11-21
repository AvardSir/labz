import React, { useState, useEffect } from "react";

const GetUserIdByLogin = ({ loginData, onUserIdFetched }) => {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (loginData && loginData.login) {
      fetch(`/api/IdByUsername_forEvents?Name=${encodeURIComponent(loginData.login)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.IdUser) {
            setUserId(data.IdUser);
            onUserIdFetched(data.IdUser);  // Передаем IdUser через callback
          } else {
            setError("Не удалось получить IdUser.");
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Ошибка при получении IdUser:", err);
          setError("Ошибка при получении IdUser.");
          setLoading(false);
        });
    }
  }, [loginData, onUserIdFetched]);

  if (loading) return <p>Загрузка...</p>;
  if (error) return <p>{error}</p>;

  return <div>{userId}</div>;
};

export default GetUserIdByLogin;
