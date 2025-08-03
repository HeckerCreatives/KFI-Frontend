import classNames from 'classnames';
import React from 'react';

type TProps = {
  label: string;
  value: string;
  labelClassName?: string;
  containerClassName?: string;
};

const DetailsCard = ({ label, value, labelClassName = '', containerClassName = '' }: TProps) => {
  return (
    <div className="w-full flex items-start gap-2 text-slate-600">
      <div className={classNames('text-slate-800 text-[0.7rem] font-semibold truncate w-fit', labelClassName)}>{label}</div>
      <div className={classNames('border border-slate-400 min-h-5 text-[0.7rem] py-0 px-3 text-sm flex items-end flex-1 rounded-md capitalize', containerClassName)}>{value}</div>
    </div>
  );
};

export default DetailsCard;
