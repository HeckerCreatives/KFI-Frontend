import classNames from 'classnames';
import React from 'react';

type UserIconProps = {
  className?: string;
};

const UserIcon = ({ className = '' }: UserIconProps) => {
  return (
    <svg
      className={classNames('feather feather-user', className)}
      fill="none"
      height="24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
};

export default UserIcon;
