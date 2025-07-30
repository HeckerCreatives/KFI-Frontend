import { IonButton } from '@ionic/react';
import classNames from 'classnames';
import { jwtDecode } from 'jwt-decode';
import { usePathname } from 'next/navigation';
import React from 'react';
import { AccessToken, Permission } from '../../../types/types';
import { isVisible } from '../../utils/permissions';
import { manageAccountResource } from '../../utils/constants';

const ManageAccountNav = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const pathname = usePathname();

  return (
    isVisible(token.role, token.permissions, manageAccountResource) && (
      <div className="flex items-center gap-2 px-3 py-2 bg-white shadow-lg rounded-2xl">
        {(token.role === 'superadmin' || token.permissions.find((e: Permission) => e.resource === 'admin' && e.actions.visible)) && (
          <IonButton
            routerLink="/dashboard/admin"
            fill="clear"
            className={classNames(
              'max-h-10 min-h-6  text-white hover:bg-[#FA6C2F] hover:border-[#FA6C2F] capitalize font-semibold rounded-md border-2',
              pathname === '/dashboard/admin' ? 'bg-[#FA6C2F] !border-orange-900' : 'bg-[#f5a04c] border-[#f5a04c]',
            )}
            strong
          >
            Admin
          </IonButton>
        )}

        {(token.role === 'superadmin' || token.permissions.find((e: Permission) => e.resource === 'clients' && e.actions.visible)) && (
          <IonButton
            routerLink="/dashboard/client"
            fill="clear"
            className={classNames(
              'max-h-10 min-h-6  text-white hover:bg-[#FA6C2F] hover:border-[#FA6C2F] capitalize font-semibold rounded-md border-2',
              pathname === '/dashboard/client' ? 'bg-[#FA6C2F] !border-orange-900' : 'bg-[#f5a04c] border-[#f5a04c]',
            )}
            strong
          >
            Client
          </IonButton>
        )}
      </div>
    )
  );
};

export default ManageAccountNav;
