import classNames from 'classnames';
import React from 'react';

type TProps = {
  label: string;
  value: string;
  labelClassName?: string;
  containerClassName?: string;
};

const ReleaseViewCard = ({ label, value, labelClassName = '', containerClassName = '' }: TProps) => {
  return (
    <div className="w-full flex items-start gap-2 ">
      <div className={classNames(' text-black !font-medium text-[0.7rem]  truncate w-fit', labelClassName)}>{label}</div>
      <div className={classNames('border border-slate-200 text-black !font-medium min-h-5 text-[0.7rem] p-2 text-sm flex items-end flex-1 rounded-md', containerClassName)}>{value}</div>
    </div>
  );
};

export default ReleaseViewCard;
