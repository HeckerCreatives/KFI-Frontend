import React from 'react';

type TProps = {
  label: string;
  value: string;
};

const AcknowledgementViewCard = ({ label, value }: TProps) => {
  return (
    <div className="w-full text-slate-600">
      <div className="text-slate-800 text-sm font-semibold">{label}</div>
      <div className="border-b border-slate-400 min-h-7 px-3 text-xs flex items-end pb-1">{value}</div>
    </div>
  );
};

export default AcknowledgementViewCard;
