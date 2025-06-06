import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableHeadRow } from '../../../../../ui/table/Table';
import { Permission } from '../../../../../../types/types';
import { systemResource } from '../../../../../utils/constants';
import UserTableRow from '../UserTableRow';

const SystemPermission = ({ permissions, setPermissions }: { permissions: Permission[]; setPermissions: React.Dispatch<React.SetStateAction<Permission[]>> }) => {
  return (
    <div>
      <h6 className="font-semibold m-0 mt-2">System</h6>
      <div className="relative overflow-auto">
        <Table>
          <TableHeader>
            <TableHeadRow className="border-b-0 bg-slate-100">
              <TableHead className="max-w-32">Page</TableHead>
              <TableHead className="text-center">Visible</TableHead>
              <TableHead className="text-center">Create</TableHead>
              <TableHead className="text-center">Read</TableHead>
              <TableHead className="text-center">Edit</TableHead>
              <TableHead className="text-center">Delete</TableHead>
              <TableHead className="text-center">Print</TableHead>
              <TableHead className="text-center">Export</TableHead>
            </TableHeadRow>
          </TableHeader>
          <TableBody>
            {permissions
              .filter((e: Permission) => systemResource.includes(e.resource))
              .map((permission: Permission) => (
                <UserTableRow key={permission._id} permission={permission} setPermissions={setPermissions} />
              ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SystemPermission;
