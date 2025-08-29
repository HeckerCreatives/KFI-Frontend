import classNames from 'classnames';
import React from 'react';

type TProps = {
  label: string;
  value: string;
  labelClassName?: string;
  containerClassName?: string;
};

const ViewClientCard = ({
  label,
  value,
  labelClassName = '',
  containerClassName = '',
}: TProps) => {
  return (
    <div className="flex gap-1">
      <span
        className={classNames(
          'text-xs font-medium text-slate-700 w-24 text-end',
          labelClassName
        )}
      >
        {label}
      </span>
      <div
        className={classNames(
          'border border-zinc-200 bg-zinc-50 rounded-lg px-3 py-2 text-sm text-slate-700 shadow-sm hover:shadow transition w-full',
          containerClassName
        )}
      >
        {value || '—'}
      </div>
    </div>
  );
};

export default ViewClientCard;
