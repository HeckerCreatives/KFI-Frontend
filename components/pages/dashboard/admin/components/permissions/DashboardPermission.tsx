import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableHeadRow } from '../../../../../ui/table/Table';
import { Permission } from '../../../../../../types/types';
import { dashboardResource } from '../../../../../utils/constants';
import UserTableRow from '../UserTableRow';

const DashboardPermission = ({ permissions, setPermissions }: { permissions: Permission[]; setPermissions: React.Dispatch<React.SetStateAction<Permission[]>> }) => {
  return (
    <div>
      <h6 className="!font-medium text-sm m-0 mt-2">Dashboard</h6>
      <div className="relative overflow-auto">
        <Table>
          <TableHeader>
            <TableHeadRow className="border-b-0 bg-slate-100">
              <TableHead className="max-w-32">Page</TableHead>
              <TableHead className="text-center">Visible</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {permissions
              .filter((e: Permission) => dashboardResource.includes(e.resource))
              .map((permission: Permission) => (
                <UserTableRow key={permission._id} permission={permission} setPermissions={setPermissions} validPermission={['visible']} />
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DashboardPermission;
