import classNames from 'classnames';
import React from 'react';

type TProps = {
  label: string;
  value: string;
  labelClassName?: string;
  containerClassName?: string;
  isAmount?: boolean;
  isPercent?: boolean;
  wrapperClassName?: string;
};

const DetailsCard = ({ label, value, labelClassName = '', containerClassName = '', isAmount = false, isPercent = false, wrapperClassName = '' }: TProps) => {
  return (
    <div className={classNames('w-full flex-col items-start gap-2 text-slate-600  p-2', wrapperClassName)}>
      <div className={classNames('text-slate-600 text-[0.8rem] truncate w-fit', labelClassName)}>{label}</div>
      <div
        className={classNames(
          'border border-slate-300 min-h-9 px-3 text-[0.8rem] text-slate-800 flex items-center flex-1 rounded-lg capitalize max-w-[50rem] break-all',
          containerClassName,
        )}
      >
        {isAmount && <span className="text-slate-500 me-1">&#8369;</span>}
        {isPercent && <span className="text-slate-500 me-1">%</span>}
        {value}
      </div>
    </div>
  );
};

export default DetailsCard;
