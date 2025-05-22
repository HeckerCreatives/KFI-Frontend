import { IonButton, IonHeader, IonIcon, IonModal, IonToolbar } from '@ionic/react';
import { arrowBackCircle, closeSharp } from 'ionicons/icons';
import React, { useState } from 'react';
import ModalHeader from '../page/ModalHeader';
import SelectionHeader from './SelectionHeader';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableHeadRow, TableRow } from '../table/Table';

const CenterSelection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  function dismiss() {
    setIsOpen(false);
  }

  const handleOpen = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="text-end">
        <IonButton onClick={handleOpen} fill="clear" className="max-h-10 min-h-6 bg-red-600 text-white capitalize font-semibold rounded-md" strong>
          <IonIcon icon={arrowBackCircle} />
        </IonButton>
      </div>
      <IonModal isOpen={isOpen} backdropDismiss={false} className="auto-height md:[--max-width:50%] md:[--width:100%] lg:[--max-width:30%] lg:[--width:50%]">
        <IonHeader>
          <IonToolbar className=" text-white [--min-height:1rem] h-10">
            <SelectionHeader dismiss={dismiss} disabled={loading} title="Center Selection" />
          </IonToolbar>
        </IonHeader>
        <div className="inner-content !p-0">
          <div className="relative overflow-auto">
            <Table>
              <TableHeader>
                <TableHeadRow className="border-b-0 bg-slate-100">
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                </TableHeadRow>
              </TableHeader>
              <TableBody>
                <TableRow className="border-b-0">
                  <TableCell className="border-4 border-slate-100">Code</TableCell>
                  <TableCell className="border-4 border-slate-100">Description</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </IonModal>
    </>
  );
};

export default CenterSelection;
