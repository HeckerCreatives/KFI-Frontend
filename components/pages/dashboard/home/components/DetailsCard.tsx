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
    <div className="w-full flex items-start gap-2 text-slate-600  p-2">
      <div className={classNames('text-slate-800 text-[0.9rem] font-semibold  truncate w-fit', labelClassName)}>{label}</div>
      <div className={classNames('border border-orange-400 min-h-10 px-3 text-[1rem] flex items-center flex-1 rounded-md capitalize max-w-[50rem] break-all', containerClassName)}>
        {value}
      </div>
    </div>
  );
};

export default DetailsCard;
