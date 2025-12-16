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
}

export default function Signatures({open, type}: Props) {
    const [signatures, setSignatures] = useState<Signatures>()
    // const finalSignatures = signatures.find((item) => item.type === type)
    const visibleDate = type === 'official receipt'
    const user = localStorage.getItem('user')

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
    
  return (
     <div className={`w-full grid ${visibleDate ? 'grid-cols-5': 'grid-cols-4'} bg-zinc-100 p-2 mt-6 text-sm font-semibold`}>
        <div className=' flex items-center gap-2'>
          Prepared by: <span className=' text-sm !font-bold capitalize'>{(user === 'EVD' || user === 'MGP') ? user : ''}</span>
        </div>
          <div className=' flex items-center gap-2'>
          Checked by: <span className=' text-sm !font-bold'>{signatures?.checkedBy}</span>
        </div>

        {visibleDate && (
        <div className=' flex items-center gap-2'>
            Date Posted: <span className=' text-sm !font-bold'>{formatDateMDY(new Date().toDateString())}</span>
        </div>
        )}

        <div className=' flex items-center gap-2'>
          Noted/Approved by: <span className=' text-sm !font-bold'>{signatures?.approvedBy || signatures?.notedBy}</span>
        </div>
        

         {visibleDate ? (
        <div className=' flex items-center gap-2'>
        Received By / Date: <span className=' text-sm !font-bold'>{signatures?.recordedBy || ''}</span>
        </div>
        ):(
          <div className=' flex items-center gap-2'>
            Recorded By / Date: <span className=' text-sm !font-bold'>{signatures?.recordedBy || ''}</span>
          </div>
        )}
       
        
      </div>
  )
}
