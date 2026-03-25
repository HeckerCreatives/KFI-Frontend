import { IonButton, IonIcon } from '@ionic/react';
import classNames from 'classnames';
import { jwtDecode } from 'jwt-decode';
import { usePathname } from 'next/navigation';
import React from 'react';
import { AccessToken, Permission } from '../../../types/types';
import { isVisible } from '../../utils/permissions';
import { manageAccountResource } from '../../utils/constants';
import { key, people } from 'ionicons/icons';
import { UserShield01Icon, UserGroupIcon } from 'hugeicons-react';

const ManageAccountNav = () => {
  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const pathname = usePathname();
  const permissions: Permission[] = JSON.parse(localStorage.getItem('permissions') || '[]')

  return (
    isVisible(token.role, permissions, manageAccountResource) && (
      <div className="flex items-center w-fit p-1 bg-white rounded-md">
        {(permissions.find((e: Permission) => e.resource === 'admin' && e.actions.visible)) && (
          <IonButton
            routerLink="/dashboard/admin"
            fill="clear"
            className={classNames(
              'h-10 text-sm capitalize font-medium rounded-md ',
              pathname === '/dashboard/admin' ? 'bg-[#FA6C2F] !border-orange-900 text-white hover:bg-[#FA6C2F] hover:border-[#FA6C2F]' : ' bg-orange-50 text-black',
            )}
            strong
          >
            <UserShield01Icon stroke='.8' size={15} className="text-sm" />
            &nbsp;Admin
          </IonButton>
        )}

        {(permissions.find((e: Permission) => e.resource === 'clients' && e.actions.visible)) && (
          <IonButton
            routerLink="/dashboard/client"
            fill="clear"
            className={classNames(
              'h-10 text-sm capitalize font-medium rounded-md',
              pathname === '/dashboard/client' ? 'bg-[#FA6C2F] !border-orange-900 text-white hover:bg-[#FA6C2F] hover:border-[#FA6C2F]' : ' bg-orange-50 text-black',
            )}
            strong
          >
            <UserGroupIcon stroke='.8' size={15} className="text-sm" />
            &nbsp;Client Master File
          </IonButton>
        )}
      </div>
    )
  );
};

export default ManageAccountNav;
