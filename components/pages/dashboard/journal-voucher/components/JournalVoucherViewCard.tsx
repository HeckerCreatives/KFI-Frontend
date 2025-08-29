import classNames from 'classnames';
import React from 'react';

type TProps = {
  label: string;
  value: string;
  labelClassName?: string;
  containerClassName?: string;
};

const JournalVoucherViewCard = ({ label, value, labelClassName = '', containerClassName = '' }: TProps) => {
  return (
    <div className="w-full flex items-start gap-2">
      <div className={classNames(' text-[0.7rem] !text-black !font-medium truncate w-fit', labelClassName)}>{label}</div>
      <div className={classNames('border border-slate-200 min-h-5 text-[0.7rem] p-2 text-sm  text-black !font-medium flex items-end flex-1 rounded-md', containerClassName)}>{value}</div>
    </div>
  );
};

export default JournalVoucherViewCard;
