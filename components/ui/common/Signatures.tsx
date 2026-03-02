import React, { useEffect, useState } from 'react'
import kfiAxios from '../../utils/axios'
import { formatDateInput, formatDateMDY } from '../../utils/date-utils'

export type Signatures = {
  approvedBy: string
  checkedBy: string
  recordedBy: string
  preparedBy: string
  notedBy: string
  type: string
  _id: string
  id: string

}

type Props = {
    open: boolean
    type: string
    approvedBy?: string
    checkedBy?: string
    recordedBy?: string
    preparedBy?: string
    recieveByorDate?: string
    notedBy?: string
    _id?: string
    id?: string
}

export default function Signatures({open, type, approvedBy, checkedBy, recordedBy, preparedBy, notedBy, recieveByorDate}: Props) {
    const [signatures, setSignatures] = useState<Signatures>()
    // const finalSignatures = signatures.find((item) => item.type === type)
    const visibleDate = type === 'official receipt'
    const user = localStorage.getItem('user')
    const currentDate = new Date

    //  const getSignatures = async () => {
    //       try {
    //         const result = await kfiAxios.get('/system-params/signature');
    //         const { signatureParams } = result.data;
    
    //         setSignatures(signatureParams)
           
    //       } catch (error) {
    //       } finally {
    //       }
    //     };

        const getSignaturesByType = async () => {
          try {
            const result = await kfiAxios.get(`/system-params/signature/by-type/${type}`);
            const { signatureParam } = result.data;

            // console.log(signatureParam, type)
    
            setSignatures(signatureParam)
           
          } catch (error) {
          } finally {
          }
        };

        useEffect(() => {
            getSignaturesByType()
        },[open])

        if(type === 'loan release' || type === 'expense voucher' || type === 'journal voucher' || type === 'emergency loan' || type === 'damayan fund'){
           return (
            <div className={`w-full grid grid-cols-4 bg-zinc-100 p-2 mt-6 text-sm font-semibold`}>
                <div className=' flex items-center gap-2'>
                  Prepared by: <span className=' text-sm !font-bold capitalize'>{preparedBy}</span>
                </div>
                  <div className=' flex items-center gap-2'>
                  Checked by: <span className=' text-sm !font-bold'>MGP</span>
                </div>
                <div className=' flex items-center gap-2'>
                  Noted/Approved by: <span className=' text-sm !font-bold'>ABE</span>
                </div>

                 <div className=' flex items-center gap-2'>
                 Received by/Date: <span className=' text-sm !font-bold'>{recieveByorDate ? recieveByorDate : currentDate.toISOString().split('T')[0]}</span>
                </div>
                
              </div>
          )
        }

        if(type === 'official receipt' || type === 'acknowledgement receipt'){
           return (
            <div className={`w-full grid grid-cols-5 bg-zinc-100 p-2 mt-6 text-sm font-semibold`}>
                <div className=' flex items-center gap-2'>
                  Prepared by: <span className=' text-sm !font-bold capitalize'>{preparedBy}</span>
                </div>
                  <div className=' flex items-center gap-2'>
                  Checked by: <span className=' text-sm !font-bold'>MGP</span>
                </div>
                <div className=' flex items-center gap-2'>
                  Noted/Approved by: <span className=' text-sm !font-bold'>ABE</span>
                </div>

                 <div className=' flex items-center gap-2'>
                 Received by/Date: <span className=' text-sm !font-bold'>{recieveByorDate ? recieveByorDate : currentDate.toISOString().split('T')[0]}</span>
                </div>

                 <div className=' flex items-center gap-2'>
                Date Posted: <span className=' text-sm !font-bold'>{currentDate.toISOString().split('T')[0]}</span>
                </div>
                
              </div>
          )
        }

}
