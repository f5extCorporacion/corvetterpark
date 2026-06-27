// components/AdminCard.tsx
import React from 'react';
import { IconType } from 'react-icons';

interface AdminCardProps {
  title: string;
  icon: IconType; // Cambiamos a tipo IconType
  value?: string | number;
  description?: string;
  color?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({
  title,
  icon: Icon, // Renombramos para usarlo como componente
  value,
  description,
  color = '#120F17',
}) => {
  return (
    <div
      className="magic-bento-card magic-bento-card--border-glow"
      style={{
        backgroundColor: color,
        '--glow-color': '255, 62, 0',
        minHeight: '180px',
      } as React.CSSProperties}
    >
      <div className="magic-bento-card__header">
        <div className="magic-bento-card__label flex items-center gap-2">
          <Icon className="text-[#FF3E00] text-xl" /> {/* Usamos el icono como componente */}
          <span>{title}</span>
        </div>
      </div>
      <div className="magic-bento-card__content">
        {value && <h2 className="magic-bento-card__title text-3xl font-bold">{value}</h2>}
        {description && <p className="magic-bento-card__description">{description}</p>}
      </div>
    </div>
  );
};

export default AdminCard;