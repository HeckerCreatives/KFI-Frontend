import classNames from 'classnames';
import React from 'react';

type TProps = {
  label: string;
  value: string;
  labelClassName?: string;
  containerClassName?: string;
};

const LoanReleaseViewCard = ({ label, value, labelClassName = '', containerClassName = '' }: TProps) => {
  return (
    <div className=" w-full flex  gap-2">
          <p
            className={classNames(
              'text-xs text-black !font-medium w-24 text-end',
              labelClassName
            )}
          >
            {label}
          </p>
          <div
            className={classNames(
              'border border-zinc-200 bg-zinc-50 rounded-lg px-3 py-2 text-sm text-black !font-medium shadow-sm hover:shadow transition w-full',
              containerClassName
            )}
          >
            {value || '—'}
          </div>
        </div>
  );
};

export default LoanReleaseViewCard;
