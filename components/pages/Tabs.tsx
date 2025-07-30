import { Redirect, Route } from 'react-router-dom';
import { IonRouterOutlet, IonHeader, IonToolbar, IonContent, IonPage, IonButton, IonPopover, IonIcon, isPlatform } from '@ionic/react';
import ChartOfAccount from './dashboard/chart-of-account/ChartOfAccount';
import Center from './dashboard/center/Center';
import ClientMasterFile from './dashboard/client-master-file/ClientMasterFile';
import Loans from './dashboard/loans/Loans';
import Bank from './dashboard/bank/Bank';
import WeeklySavingTable from './dashboard/weekly-saving-table/WeeklySavingTable';
import Supplier from './dashboard/supplier/Supplier';
import BusinessType from './dashboard/business-type/BusinessType';
import GroupAccount from './dashboard/group-account/GroupAccount';
import logoNoBg from '../assets/images/logo-nobg.png';
import Image from 'next/image';
import { logOut, settingsOutline } from 'ionicons/icons';
import Admin from './dashboard/admin/Admin';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '../../types/types';
import Dashboard from './dashboard/home/Dashboard';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Acknowledgement from './dashboard/acknowledgement/Acknowledgement';
import Release from './dashboard/release/Release';
import AuditTrail from './dashboard/audit-trail/AuditTrail';
import FinancialStatement from './dashboard/financial-statement/FinancialStatement';
import TrialBalance from './dashboard/trial-balance/TrialBalance';
import UnbalanceEntries from './dashboard/unbalance-entries/UnbalanceEntries';
import LoginLogs from './dashboard/login-logs/LoginLogs';
import ActionLogs from './dashboard/action-logs/ActionLogs';
import LoanRelease from './dashboard/loan-release/LoanRelease';
import ExpenseVoucher from './dashboard/expense-voucher/ExpenseVoucher';
import JournalVoucher from './dashboard/journal-voucher/JournalVoucher';
import EmergencyLoan from './dashboard/emergency-loan/EmergencyLoan';
import DamayanFund from './dashboard/damayan-fund/DamayanFund';
import TopNavigation from '../ui/page/TopNavigation';

const Tabs = () => {
  const [isOpen, setIsOpen] = useState(true);

  const token: AccessToken = jwtDecode(localStorage.getItem('auth') as string);
  const pathname = usePathname();

  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const desktopMode = isPlatform('desktop') && window.innerWidth > 991;
      setIsDesktop(desktopMode);
      if (desktopMode) setIsOpen(true);
    };

    checkScreenSize();

    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const logout = () => {
    localStorage.removeItem('auth');
    if (isPlatform('capacitor')) {
      (window as any).location.reload(true);
    } else if (isPlatform('electron')) {
      (window as any).ipcRenderer.send('reload-window');
    } else {
      (window as any).location.reload();
    }
  };

  return (
    <IonPage id="main-content">
      <IonHeader class=" ion-no-border border-b">
        <IonToolbar className="pe-5 ps-2 [--min-height:3.5rem] !shadow-none border-b">
          <div className="flex items-center justify-between">
            {/* <div>
              <IonMenuButton menu="main-content" autoHide={true} />
              {isDesktop && <IonMenuButton autoHide={false} onClick={() => setIsOpen(prev => !prev)} />}
            </div> */}
            <div className="h-6 border-b bg-cover ps-2 flex items-center">
              <div className="w-full bg-slate-100/50">
                <Image alt="logo" src={logoNoBg} className="h-6 w-auto" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-5">
              <div className="flex items-center justify-center gap-2 capitalize">
                <span className="block text-[0.9rem] font-semibold">{token.username}</span>
                <IonButton
                  fill="clear"
                  className="min-h-[3.5rem] [--padding-start:0] [--padding-end:0] [--padding-bottom:0] [--padding-top:0] border-[#FA6C2F] !m-0  [--color:black] font-bold  [--ripple-color:transparent]"
                  id="click-trigger"
                >
                  <div className="w-10 h-10 bg-[#FFF0E3] rounded-full uppercase grid place-items-center min-w-10 min-h-10">{token.username.substring(0, 2)}</div>
                </IonButton>
              </div>
              <IonPopover showBackdrop={false} trigger="click-trigger" triggerAction="click" className="[--max-width:12rem]">
                <IonContent class="[--padding-top:0.25rem] [--padding-bottom:0.25rem]">
                  <div className="flex items-center gap-2 text-[0.8rem] text-slate-700 font-semibold hover:bg-slate-100 py-1 px-3 cursor-pointer active:bg-slate-200">
                    <IonIcon icon={settingsOutline} /> Settings
                  </div>
                  <div
                    onClick={logout}
                    className="flex items-center gap-2 text-[0.8rem] text-slate-700 font-semibold hover:bg-slate-100 py-1 px-3 cursor-pointer active:bg-slate-200"
                  >
                    <IonIcon icon={logOut} /> Logout
                  </div>
                </IonContent>
              </IonPopover>
            </div>
          </div>
        </IonToolbar>
        <TopNavigation />
      </IonHeader>
      <IonContent>
        <IonRouterOutlet>
          <Route path="/dashboard" render={() => <Redirect to={'/dashboard/home'} />} exact={true} />
          <Route path="/dashboard/home" render={() => <Dashboard />} exact={true} />

          {/* Manage Account */}
          <Route path="/dashboard/admin" render={() => <Admin />} exact={true} />
          <Route path="/dashboard/client" render={() => <ClientMasterFile />} exact={true} />
          {/* Manage Account Ends */}

          {/* Transactions */}
          <Route path="/dashboard/loan-release" render={() => <LoanRelease />} exact={true} />
          <Route path="/dashboard/expense-voucher" render={() => <ExpenseVoucher />} exact={true} />
          <Route path="/dashboard/journal-voucher" render={() => <JournalVoucher />} exact={true} />
          <Route path="/dashboard/acknowledgement" render={() => <Acknowledgement />} exact={true} />
          <Route path="/dashboard/release" render={() => <Release />} exact={true} />
          <Route path="/dashboard/emergency-loan" render={() => <EmergencyLoan />} exact={true} />
          <Route path="/dashboard/damayan-fund" render={() => <DamayanFund />} exact={true} />
          {/* Transactions Ends */}

          {/* General Ledger */}
          <Route path="/dashboard/audit-trail" render={() => <AuditTrail />} exact={true} />
          <Route path="/dashboard/financial-statement" render={() => <FinancialStatement />} exact={true} />
          <Route path="/dashboard/trial-balance" render={() => <TrialBalance />} exact={true} />
          {/* General Ledger Ends */}

          {/* System */}
          <Route path="/dashboard/group-of-account" render={() => <GroupAccount />} exact={true} />
          <Route path="/dashboard/chart-of-account" render={() => <ChartOfAccount />} exact={true} />
          <Route path="/dashboard/product" render={() => <Loans />} exact={true} />
          <Route path="/dashboard/center" render={() => <Center />} exact={true} />
          <Route path="/dashboard/bank" render={() => <Bank />} exact={true} />
          <Route path="/dashboard/weekly-savings" render={() => <WeeklySavingTable />} exact={true} />
          <Route path="/dashboard/business-type" render={() => <BusinessType />} exact={true} />
          <Route path="/dashboard/business-supplier" render={() => <Supplier />} exact={true} />
          {/* System Ends */}

          {/* Diagnostics */}
          <Route path="/dashboard/unbalance-entries" render={() => <UnbalanceEntries />} exact={true} />
          <Route path="/dashboard/login-logs" render={() => <LoginLogs />} exact={true} />
          <Route path="/dashboard/action-logs" render={() => <ActionLogs />} exact={true} />
          {/* Diagnostics Ends */}

          {/* <Route path="/dashboard/nature" render={() => <Nature />} exact={true} />
            <Route path="/dashboard/status" render={() => <Status />} exact={true} /> */}
        </IonRouterOutlet>
      </IonContent>
    </IonPage>
    // <IonSplitPane when="lg" contentId="main-content" className={classNames('w-full transition-all duration-300 ease-in-out')} disabled={!isOpen}>
    //   <IonMenu contentId="main-content" menuId="main-content" class="lg:max-w-64" disabled={isPlatform('desktop') && !isOpen}>
    //     <IonContent>
    //       <div>
    //         <div className="h-20 border-b bg-cover flex items-end">
    //           <div className="w-full bg-slate-100/50 p-5">
    //             <Image alt="logo" src={logoNoBg} className="h-12 w-auto" />
    //           </div>
    //         </div>
    //         <div className="space-y-2 px-2.5 mb-2 mt-5">
    //           <IonMenuToggle autoHide={false} className="">
    //             <IonItem
    //               routerLink="/dashboard/home"
    //               className={classNames(
    //                 '!text-[0.9rem] [--padding-start:0rem] [--min-height:2.25rem] [--border-color:transparent] space-x-2 text-slate-500 hover:[--color:#FA6C2F]',
    //                 pathname === '/dashboard/home' && '!text-[#fa6c2f]',
    //               )}
    //             >
    //               <div className="flex items-center justify-start gap-2 px-3">
    //                 <IonIcon size="small" icon={homeOutline} />
    //                 <IonLabel>Dashboard</IonLabel>
    //               </div>
    //             </IonItem>
    //           </IonMenuToggle>
    //         </div>
    //         {isVisible(token.role, token.permissions, manageAccountResource) && (
    //           <div className="space-y-2 px-2.5 mb-2 mt-5">
    //             <IonMenuToggle autoHide={false} className="">
    //               <IonItem
    //                 routerLink="/dashboard/admin"
    //                 className={classNames(
    //                   '!text-[0.9rem] [--padding-start:0rem] [--min-height:2.25rem] [--border-color:transparent] space-x-2 text-slate-500 hover:[--color:#FA6C2F]',
    //                   pathname === '/dashboard/admin' && '!text-[#fa6c2f]',
    //                 )}
    //               >
    //                 <div className="flex items-center justify-start gap-2 px-3">
    //                   <IonIcon size="small" icon={keyOutline} />
    //                   <IonLabel>Manage Account</IonLabel>
    //                 </div>
    //               </IonItem>
    //             </IonMenuToggle>
    //           </div>
    //         )}
    //         <IonAccordionGroup className="space-y-2 px-3">
    //           {isVisible(token.role, token.permissions, manageAccountResource) && <ManageAccount />}
    //           {isVisible(token.role, token.permissions, transactionResource) && <TransactionNavigation />}
    //           {isVisible(token.role, token.permissions, generalLedgerResource) && <GeneralLedgerNav />}
    //           {isVisible(token.role, token.permissions, systemResource) && <SystemNav />}
    //           {isVisible(token.role, token.permissions, diagnosticsResource) && <DiagnosticsNav />}
    //         </IonAccordionGroup>
    //       </div>
    //     </IonContent>
    //   </IonMenu>
    // </IonSplitPane>
  );
};

export default Tabs;
