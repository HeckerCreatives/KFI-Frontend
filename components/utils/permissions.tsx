import { ActionType, Permission } from '../../types/types';

export const haveActions = (role: string, resource: string, permissions: Permission[], actions: string[]) => {
  if (role === 'superadmin') return true;
  const permission = permissions.find((permission: Permission) => permission.resource === resource);
  if (!permission) return false;
  const haveAction = (Object.keys(permission.actions) as ActionType[]).some((action: ActionType) => actions.includes(action) && permission.actions[action]);
  return haveAction;
};

export const canDoAction = (role: string, permissions: Permission[], resource: string, action: ActionType) =>
  role === 'superadmin' || permissions.find((permission: Permission) => permission.resource === resource && permission.actions[action]);

export const isVisible = (role: string, permissions: Permission[], resources: string[]) =>
  role === 'superadmin' ||
  permissions.some(
    (permission: Permission) => resources.includes(permission.resource) && (Object.keys(permission.actions) as ActionType[]).some(action => permission.actions[action]),
  );
