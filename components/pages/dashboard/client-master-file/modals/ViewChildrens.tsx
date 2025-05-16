import { IonHeader, IonIcon, IonModal, IonToolbar } from '@ionic/react';
import { people } from 'ionicons/icons';
import React, { useRef } from 'react';
import { Child, ClientMasterFile } from '../../../../../types/types';
import ModalHeader from '../../../../ui/page/ModalHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../../../../ui/table/Table';
import CreateChildren from './CreateChildren';
import { TClientMasterFile } from '../ClientMasterFile';
import DeleteChildren from './DeleteChildren';
import UpdateChildren from './UpdateChildren';

type ViewChildrensProps = {
  client: ClientMasterFile;
  setData: React.Dispatch<React.SetStateAction<TClientMasterFile>>;
};

const ViewChildrens = ({ client, setData }: ViewChildrensProps) => {
  const modal = useRef<HTMLIonModalElement>(null);

  function dismiss() {
    modal.current?.dismiss();
  }

  return (
    <>
      <div className="text-end">
        <div
          id={`view-children-modal-${client._id}`}
          className="w-full flex items-center justify-start gap-2 text-sm font-semibold cursor-pointer active:bg-slate-200 hover:bg-slate-50 text-slate-600 px-2 py-1"
        >
          <IonIcon icon={people} className="text-[1rem]" /> View Children
        </div>
      </div>
      <IonModal
        ref={modal}
        trigger={`view-children-modal-${client._id}`}
        backdropDismiss={false}
        className="auto-height md:[--max-width:90%] md:[--width:100%] lg:[--max-width:50%] lg:[--width:50%]"
      >
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-20">
            <ModalHeader title="Client Master File - View Children" sub="Manage Account" dismiss={dismiss} />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content">
          <div className="py-1">
            <CreateChildren client={client} setData={setData} />
          </div>
          {client.children.length < 1 && <div className="text-center text-slate-700 text-sm py-3">No Children Found</div>}
          {client.children.length > 0 && (
            <div className="relative overflow-auto">
              <Table>
                <TableHeader>
                  <TableHeadRow className="border-b-0 bg-slate-100">
                    <TableHead>Child Name</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableHeadRow>
                </TableHeader>
                <TableBody>
                  {client.children.map((child: Child) => (
                    <TableRow key={child._id} className="border-b-0 hover:!bg-transparent">
                      <TableCell className="border-4 border-slate-100">{child.name}</TableCell>
                      <TableCell className="border-4 border-slate-100">
                        <div className="flex items-center gap-2">
                          <UpdateChildren child={child} setData={setData} />
                          <DeleteChildren child={child} setData={setData} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </IonModal>
    </>
  );
};

export default ViewChildrens;
