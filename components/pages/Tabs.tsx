import { Redirect, Route } from 'react-router-dom';
import {
  IonRouterOutlet,
  IonHeader,
  IonToolbar,
  IonContent,
  IonPage,
  IonButton,
  IonMenu,
  IonSplitPane,
  IonPopover,
  IonIcon,
  IonItem,
  IonMenuToggle,
  IonLabel,
  IonAccordionGroup,
  IonMenuButton,
  isPlatform,
} from '@ionic/react';
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
import { chevronDownOutline, homeOutline, logOut, settingsOutline } from 'ionicons/icons';
import TransactionNavigation from '../ui/navs/TransactionNavigation';
import LoanRelease from './dashboard/transactions/loan-release/LoanRelease';
import ExpenseVoucher from './dashboard/transactions/expense-voucher/ExpenseVoucher';
import JournalVoucher from './dashboard/transactions/journal-voucher/JournalVoucher';
import ManageAccount from '../ui/navs/ManageAccount';
import Admin from './dashboard/admin/Admin';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '../../types/types';
import { diagnosticsResource, generalLedgerResource, manageAccountResource, systemResource, transactionResource } from '../utils/constants';
import Dashboard from './dashboard/home/Dashboard';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { isVisible } from '../utils/permissions';
import { useEffect, useState } from 'react';
import GeneralLedgerNav from '../ui/navs/GeneralLedgerNav';
import SystemNav from '../ui/navs/SystemNav';
import DiagnosticsNav from '../ui/navs/DiagnosticsNav';
import Acknowledgement from './dashboard/acknowledgement/Acknowledgement';
import Release from './dashboard/release/Release';
import AuditTrail from './dashboard/audit-trail/AuditTrail';
import FinancialStatement from './dashboard/financial-statement/FinancialStatement';
import TrialBalance from './dashboard/trial-balance/TrialBalance';
import UnbalanceEntries from './dashboard/unbalance-entries/UnbalanceEntries';
import LoginLogs from './dashboard/login-logs/LoginLogs';
import ActionLogs from './dashboard/action-logs/ActionLogs';

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
    <IonSplitPane when="lg" contentId="main-content" className={classNames('w-full transition-all duration-300 ease-in-out')} disabled={!isOpen}>
      <IonMenu contentId="main-content" menuId="main-content" class="lg:max-w-64" disabled={isPlatform('desktop') && !isOpen}>
        <IonContent>
          <div>
            <div className="h-40 bg-desktop bg-cover flex items-end">
              <div className="w-full bg-slate-100/50 px-5 py-2">
                <Image alt="logo" src={logoNoBg} className="h-10 w-auto" />
              </div>
            </div>
            <div className="space-y-2 px-2.5 mb-2 mt-5">
              <IonMenuToggle autoHide={false} className="">
                <IonItem
                  routerLink="/dashboard/home"
                  className={classNames(
                    '!text-[0.9rem] [--padding-start:0rem] [--min-height:2.25rem] [--border-color:transparent] space-x-2 text-slate-500 hover:[--color:#FA6C2F]',
                    pathname === '/dashboard/home' && '!text-[#fa6c2f]',
                  )}
                >
                  <div className="flex items-center justify-start gap-2 px-3">
                    <IonIcon size="small" icon={homeOutline} />
                    <IonLabel>Dashboard</IonLabel>
                  </div>
                </IonItem>
              </IonMenuToggle>
            </div>
            <IonAccordionGroup className="space-y-2 px-3">
              {isVisible(token.role, token.permissions, manageAccountResource) && <ManageAccount />}
              {isVisible(token.role, token.permissions, transactionResource) && <TransactionNavigation />}
              {isVisible(token.role, token.permissions, generalLedgerResource) && <GeneralLedgerNav />}
              {isVisible(token.role, token.permissions, systemResource) && <SystemNav />}
              {isVisible(token.role, token.permissions, diagnosticsResource) && <DiagnosticsNav />}
            </IonAccordionGroup>
          </div>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar className="pe-5 ps-2 [--min-height:3.5rem]">
            <div className="flex items-center justify-between">
              <div>
                <IonMenuButton menu="main-content" autoHide={true} />
                {isDesktop && <IonMenuButton autoHide={false} onClick={() => setIsOpen(prev => !prev)} />}
              </div>
              <div className="flex items-center justify-center gap-5">
                <IonButton
                  fill="clear"
                  className="min-h-[3.5rem] min-w-40 border-[#FA6C2F] px-1 !m-0 bg-[#FFF0E3] [--color:black] font-bold space-x-4 capitalize"
                  id="click-trigger"
                >
                  <div className="w-10 h-10 bg-slate-300 rounded-full uppercase grid place-items-center min-w-10 min-h-10">{token.username.substring(0, 2)}</div>
                  <span>{token.username}</span> <IonIcon className="text-[#FA6C2F] stroke w-4 h-4" icon={chevronDownOutline} />
                </IonButton>
                <IonPopover showBackdrop={false} trigger="click-trigger" triggerAction="click">
                  <IonContent class="[--padding-top:0.5rem] [--padding-bottom:0.5rem]">
                    <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold hover:bg-slate-100 py-3 px-3 cursor-pointer active:bg-slate-200">
                      <IonIcon icon={settingsOutline} /> Settings
                    </div>
                    <div onClick={logout} className="flex items-center gap-2 text-sm text-slate-700 font-semibold hover:bg-slate-100 py-3 px-3 cursor-pointer active:bg-slate-200">
                      <IonIcon icon={logOut} /> Logout
                    </div>
                  </IonContent>
                </IonPopover>
              </div>
            </div>
          </IonToolbar>
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
    </IonSplitPane>
  );
};

export default Tabs;
