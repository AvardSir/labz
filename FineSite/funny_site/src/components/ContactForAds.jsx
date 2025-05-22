import React from "react";
import "../css/ContactForAds.css";

const ContactForAds = () => {
  return (
    <div className="contact-ads-block">
      <h2 className="contact-ads-title">Связаться с нами</h2> {/* Применяем новый класс */}
      <p>
        По вопросам размещения рекламы пишите на:{" "}
        <a href="mailto:ads_FunnySite@gmail.com">ads_FunnySite@gmail.com</a>
      </p>
      <p>
    По вопросам предложения мероприятий или анекдотов пишите на:{" "}
    <a href="mailto:content_FunnySite@gmail.com">events_FunnySite@gmail.com</a>
</p>
    </div>
  );
};

export default ContactForAds;
