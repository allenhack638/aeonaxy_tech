import React from "react";

const SelectableCard = ({
  imageSrc,
  title,
  id,
  isSelected,
  onClick,
  disabled,
}) => {
  const handleCardClick = () => {
    if (!disabled) {
      onClick(id);
    }
  };

  return (
    <div
      className={`selectable-card ${isSelected ? "selected" : ""}`}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      <label htmlFor={id}>
        <img src={imageSrc} alt={title} />
        <h3>{title}</h3>
        <input
          type="checkbox"
          id={id}
          checked={isSelected}
          onChange={handleCardClick}
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default SelectableCard;
