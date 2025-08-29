import classNames from 'classnames';
import React from 'react';

type TProps = {
  label: string;
  value: string;
  labelClassName?: string;
  containerClassName?: string;
};

const ExpenseVoucherViewCard = ({ label, value, labelClassName = '', containerClassName = '' }: TProps) => {
  return (
     <div className="flex gap-1">
              <span
                className={classNames(
                  'text-xs !font-medium text-black w-24 text-end',
                  labelClassName
                )}
              >
                {label}
              </span>
              <div
                className={classNames(
                  'border border-zinc-200 rounded-lg px-3 py-2 text-sm !font-medium text-black shadow-sm hover:shadow transition flex-1',
                  containerClassName
                )}
              >
                {value || '—'}
              </div>
            </div>
  );
};

export default ExpenseVoucherViewCard;
