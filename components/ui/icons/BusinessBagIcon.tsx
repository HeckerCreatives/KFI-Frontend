import React from 'react';

type BusinessBagIconProps = {
  className?: string;
};

const BusinessBagIcon = ({ className = '' }: BusinessBagIconProps) => {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <title />
      <g id="suitcase">
        <path d="M20,5H17V4a3,3,0,0,0-3-3H10A3,3,0,0,0,7,4V5H4A3,3,0,0,0,1,8V20a3,3,0,0,0,3,3H20a3,3,0,0,0,3-3V8A3,3,0,0,0,20,5ZM17,7V21H7V7ZM9,4a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1V5H9ZM3,20V8A1,1,0,0,1,4,7H5V21H4A1,1,0,0,1,3,20Zm18,0a1,1,0,0,1-1,1H19V7h1a1,1,0,0,1,1,1Z" />
      </g>
    </svg>
  );
};

export default BusinessBagIcon;
