import React from 'react';
import { TableCell, TableRow } from '../../../../ui/table/Table';
import { Permission } from '../../../../../types/types';
import { IonCheckbox } from '@ionic/react';

type UserTableRowProps = {
  permission: Permission;
  setPermissions: React.Dispatch<React.SetStateAction<Permission[]>>;
};

interface IonChangeEventDetail {
  value: 'create' | 'visible' | 'view' | 'update' | 'delete' | 'print' | 'export';
  checked: boolean;
}

const UserTableRow = ({ permission, setPermissions }: UserTableRowProps) => {
  const handleChecked = (e: CustomEvent<IonChangeEventDetail>) => {
    const { checked, value } = e.detail;

    setPermissions(prev => {
      let clone = [...prev];
      let index = clone.findIndex(e => e._id === permission._id && e.resource === permission.resource);
      if (value === 'visible' && !checked) {
        clone[index].actions = { visible: false, create: false, view: false, update: false, delete: false, print: false, export: false };
      } else {
        clone[index].actions[`${value}`] = checked;
      }
      return clone;
    });
  };

  return (
    <TableRow>
      <TableCell className="capitalize max-w-32">{permission.resource}</TableCell>
      <TableCell className="text-center">
        <IonCheckbox checked={permission.actions.visible} value="visible" onIonChange={handleChecked} />
      </TableCell>
      <TableCell className="text-center">
        <IonCheckbox checked={permission.actions.create} value="create" onIonChange={handleChecked} />
      </TableCell>
      <TableCell className="text-center">
        <IonCheckbox checked={permission.actions.view} value="view" onIonChange={handleChecked} />
      </TableCell>
      <TableCell className="text-center">
        <IonCheckbox checked={permission.actions.update} value="update" onIonChange={handleChecked} />
      </TableCell>
      <TableCell className="text-center">
        <IonCheckbox checked={permission.actions.delete} value="delete" onIonChange={handleChecked} />
      </TableCell>
      <TableCell className="text-center">
        <IonCheckbox checked={permission.actions.print} value="print" onIonChange={handleChecked} />
      </TableCell>
      <TableCell className="text-center">
        <IonCheckbox checked={permission.actions.export} value="export" onIonChange={handleChecked} />
      </TableCell>
    </TableRow>
  );
};

export default UserTableRow;
