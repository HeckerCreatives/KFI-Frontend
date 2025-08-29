import classNames from 'classnames';
import React from 'react';

type TProps = {
  label: string;
  value: string;
  labelClassName?: string;
  containerClassName?: string;
};

const ViewCenterCard = ({ label, value, labelClassName = '', containerClassName = '' }: TProps) => {
  return (
    <div className="w-full flex items-start gap-2 text-slate-900">
      <div className={classNames('text-slate-900 text-[0.85rem]  font-semibold truncate w-fit', labelClassName)}>{label}</div>
      <div className={classNames('border border-slate-200 min-h-8 text-[0.7rem] p-2 text-sm flex items-center flex-1 rounded-md capitalize', containerClassName)}>
        {value}
      </div>
    </div>
  );
};

export default ViewCenterCard;
