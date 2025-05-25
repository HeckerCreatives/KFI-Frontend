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
  IonAccordion,
  isPlatform,
} from '@ionic/react';
import ChartOfAccount from './dashboard/chart-of-account/ChartOfAccount';
import Center from './dashboard/center/Center';
import ClientMasterFile from './dashboard/client-master-file/ClientMasterFile';
import ClientProfile from './dashboard/client-profile/ClientProfile';
import Loans from './dashboard/loans/Loans';
import Bank from './dashboard/bank/Bank';
import WeeklySavingTable from './dashboard/weekly-saving-table/WeeklySavingTable';
import Supplier from './dashboard/supplier/Supplier';
import BusinessType from './dashboard/business-type/BusinessType';
import BusinessFix from './dashboard/business-fix/BusinessFix';
import Nature from './dashboard/nature/Nature';
import GroupAccount from './dashboard/group-account/GroupAccount';
import logoNoBg from '../assets/images/logo-nobg.png';
import Image from 'next/image';
import { chevronDownOutline, documentAttachOutline, documentOutline, hammerOutline, homeOutline, logOut, settingsOutline } from 'ionicons/icons';
import TransactionNavigation from '../ui/navs/TransactionNavigation';
import LoanRelease from './dashboard/transactions/loan-release/LoanRelease';
import ExpenseVoucher from './dashboard/transactions/expense-voucher/ExpenseVoucher';
import JournalVoucher from './dashboard/transactions/journal-voucher/JournalVoucher';
import OfficialReceipt from './dashboard/transactions/official-receipt/OfficialReceipt';
import EmergencyLoan from './dashboard/transactions/emergency-loan/EmergencyLoan';
import DamayanFund from './dashboard/transactions/damayan-fund/DamayanFund';
import StatementOfAccountReport from './dashboard/reports/statement-of-account/StatementOfAccountReport';
import ClientProfileReport from './dashboard/reports/client-profile/ClientProfileReport';
import CenterReport from './dashboard/reports/center/CenterReport';
import WeeklyCollectionReport from './dashboard/reports/weekly-collection/WeeklyCollectionReport';
import JournalVoucherReport from './dashboard/reports/journal-voucher/JournalVoucherReport';
import ExpenseVoucherReport from './dashboard/reports/expense-voucher/ExpenseVoucherReport';
import OfficialReceiptReport from './dashboard/reports/official-receipt/OfficialReceiptReport';
import LoanReleaseReport from './dashboard/reports/loan-release/LoanReleaseReport';
import DamayanFundReport from './dashboard/reports/damayan-fund/DamayanFundReport';
import EmergencyLoanReport from './dashboard/reports/emergency-loan/EmergencyLoanReport';
import LoanReleaseVsOrReport from './dashboard/reports/loan-release-vs-or/LoanReleaseVsOrReport';
import ProjectionByDueDateReport from './dashboard/reports/projection-by-due-date/ProjectionByDueDateReport';
import ManageAccount from '../ui/navs/ManageAccount';
import AllFiles from '../ui/navs/AllFiles';
import Admin from './dashboard/admin/Admin';
import { jwtDecode } from 'jwt-decode';
import { AccessToken } from '../../types/types';
import { allFilesResource, manageAccountResource, transactionResource } from '../utils/constants';
import Dashboard from './dashboard/home/Dashboard';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import { isVisible } from '../utils/permissions';
import Status from './dashboard/status/Status';
import { useEffect, useState } from 'react';

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
              {isVisible(token.role, token.permissions, allFilesResource) && <AllFiles />}
              <IonAccordion value="reports" className="bg-transparent">
                <IonItem
                  slot="header"
                  className={classNames(
                    '!text-[0.9rem] space-x-2 text-slate-500 [--padding-start:0.5rem] [--padding-end:0.5rem] hover:[--color:#FA6C2F] [--border-color:transparent] [--background:transparent]',
                  )}
                >
                  <IonIcon size="small" icon={documentOutline} className="!text-inherit" />
                  <IonLabel className="text-sm">Reports</IonLabel>
                </IonItem>
                <div slot="content"></div>
              </IonAccordion>
              {isVisible(token.role, token.permissions, transactionResource) && <TransactionNavigation />}
              <IonAccordion value="general ledger" className="bg-transparent">
                <IonItem
                  slot="header"
                  className={classNames(
                    '!text-[0.9rem] space-x-2 text-slate-500 [--padding-start:0.5rem] [--padding-end:0.5rem] hover:[--color:#FA6C2F] [--border-color:transparent] [--background:transparent]',
                  )}
                >
                  <IonIcon size="small" icon={documentAttachOutline} className="!text-inherit" />
                  <IonLabel className="text-sm">General Ledger</IonLabel>
                </IonItem>
                <div slot="content"></div>
              </IonAccordion>
              <IonAccordion value="utilities" className="bg-transparent">
                <IonItem
                  slot="header"
                  className={classNames(
                    '!text-[0.9rem] space-x-2 text-slate-500 [--padding-start:0.5rem] [--padding-end:0.5rem] hover:[--color:#FA6C2F] [--border-color:transparent] [--background:transparent]',
                  )}
                >
                  <IonIcon size="small" icon={hammerOutline} className="!text-inherit" />
                  <IonLabel className="text-sm">Utilities</IonLabel>
                </IonItem>
                <div slot="content"></div>
              </IonAccordion>
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
            <Route path="/dashboard/admin" render={() => <Admin />} exact={true} />
            <Route path="/dashboard/chart-of-account" render={() => <ChartOfAccount />} exact={true} />
            <Route path="/dashboard/center" render={() => <Center />} exact={true} />
            <Route path="/dashboard/client-master-file" render={() => <ClientMasterFile />} exact={true} />
            <Route path="/dashboard/client-profile" render={() => <ClientProfile />} exact={true} />
            <Route path="/dashboard/loans" render={() => <Loans />} exact={true} />
            <Route path="/dashboard/bank" render={() => <Bank />} exact={true} />
            <Route path="/dashboard/weekly-saving-table" render={() => <WeeklySavingTable />} exact={true} />
            <Route path="/dashboard/supplier" render={() => <Supplier />} exact={true} />
            <Route path="/dashboard/business-type" render={() => <BusinessType />} exact={true} />
            <Route path="/dashboard/business-fix" render={() => <BusinessFix />} exact={true} />
            <Route path="/dashboard/nature" render={() => <Nature />} exact={true} />
            <Route path="/dashboard/status" render={() => <Status />} exact={true} />
            {/* Transactions */}
            <Route path="/dashboard/group-account" render={() => <GroupAccount />} exact={true} />
            <Route path="/dashboard/loan-release" render={() => <LoanRelease />} exact={true} />
            <Route path="/dashboard/expense-voucher" render={() => <ExpenseVoucher />} exact={true} />
            <Route path="/dashboard/journal-voucher" render={() => <JournalVoucher />} exact={true} />
            <Route path="/dashboard/official-receipt" render={() => <OfficialReceipt />} exact={true} />
            <Route path="/dashboard/emergency-loan" render={() => <EmergencyLoan />} exact={true} />
            <Route path="/dashboard/damayan-fund" render={() => <DamayanFund />} exact={true} />
            {/* Reports */}
            <Route path="/dashboard/soa-report" render={() => <StatementOfAccountReport />} exact={true} />
            <Route path="/dashboard/cp-report" render={() => <ClientProfileReport />} exact={true} />
            <Route path="/dashboard/center-report" render={() => <CenterReport />} exact={true} />
            <Route path="/dashboard/wc-report" render={() => <WeeklyCollectionReport />} exact={true} />
            <Route path="/dashboard/jv-report" render={() => <JournalVoucherReport />} exact={true} />
            <Route path="/dashboard/ev-report" render={() => <ExpenseVoucherReport />} exact={true} />
            <Route path="/dashboard/or-report" render={() => <OfficialReceiptReport />} exact={true} />
            <Route path="/dashboard/lr-report" render={() => <LoanReleaseReport />} exact={true} />
            <Route path="/dashboard/df-report" render={() => <DamayanFundReport />} exact={true} />
            <Route path="/dashboard/el-report" render={() => <EmergencyLoanReport />} exact={true} />
            <Route path="/dashboard/lrvor-report" render={() => <LoanReleaseVsOrReport />} exact={true} />
            <Route path="/dashboard/pbd-report" render={() => <ProjectionByDueDateReport />} exact={true} />
          </IonRouterOutlet>
        </IonContent>
      </IonPage>
    </IonSplitPane>
  );
};

export default Tabs;
