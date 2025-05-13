import { Redirect, Route } from 'react-router-dom';
import {
  IonRouterOutlet,
  IonHeader,
  IonToolbar,
  IonContent,
  IonPage,
  IonButton,
  IonMenu,
  IonTitle,
  IonSplitPane,
  IonPopover,
  IonIcon,
  IonItem,
  IonMenuToggle,
  IonLabel,
  IonAccordion,
  IonAccordionGroup,
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
import CreateClient from './dashboard/client-master-file/CreateClient';
import logo from '../assets/images/logo.png';
import Image from 'next/image';
import { cellular, chevronDownOutline, hammerOutline, logOut, settingsOutline } from 'ionicons/icons';
import FileNavigation from '../ui/navs/FileNavigation';
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
import ReportsNavigation from '../ui/navs/ReportsNavigation';

const Tabs = () => {
  return (
    <IonSplitPane when="lg" contentId="main-content" class="w-full">
      <IonMenu contentId="main-content" class="lg:max-w-64">
        <IonHeader>
          <IonToolbar>
            <IonTitle>
              <Image alt="logo" src={logo} className="h-10 w-auto" />
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="[--background:#FFF0E3]">
          <div>
            <div>
              <h6 className="text-slate-400 text-sm italic px-3 mb-0 mt-7">Navigation</h6>
              <IonMenuToggle autoHide={false} className="">
                <IonItem routerLink="/dashboard" className="[--padding-start:0] [--min-height:2.25rem] text-[1rem] space-x-2 text-slate-500 hover:[--color:#FA6C2F]">
                  <div className="flex items-center justify-start gap-2 px-3">
                    <IonIcon size="small" icon={cellular} />
                    <IonLabel>Dashboard</IonLabel>
                  </div>
                </IonItem>
              </IonMenuToggle>
            </div>
            <FileNavigation />
            <div>
              <h6 className="text-slate-400 text-sm italic px-3 mb-0 mt-1">All Actions</h6>
              <IonAccordionGroup>
                <TransactionNavigation />
                <ReportsNavigation />
                <IonAccordion value="third">
                  <IonItem slot="header" className="!text-[1rem] space-x-2 text-slate-500 [--padding-start:0.25rem] [--padding-end:0] hover:[--color:#FA6C2F]">
                    <IonIcon size="small" icon={cellular} className="!text-inherit" />
                    <IonLabel>General Ledger</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    Third Content
                  </div>
                </IonAccordion>
                <IonAccordion value="fourth">
                  <IonItem slot="header" className="!text-[1rem] space-x-2 text-slate-500 [--padding-start:0.25rem] [--padding-end:0] hover:[--color:#FA6C2F]">
                    <IonIcon size="small" icon={cellular} className="!text-inherit" />
                    <IonLabel>Utilities</IonLabel>
                  </IonItem>
                  <div className="ion-padding" slot="content">
                    Third Content
                  </div>
                </IonAccordion>
              </IonAccordionGroup>
            </div>
          </div>
        </IonContent>
      </IonMenu>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar className="px-5 [--min-height:3.5rem]">
            <div className="flex items-center justify-end gap-5">
              <IonIcon icon={settingsOutline} className="w-7 h-7 text-[#FA6C2F] cursor-pointer" />
              <IonIcon icon={hammerOutline} className="w-7 h-7 text-[#FA6C2F] cursor-pointer" />
              <IonButton
                fill="clear"
                className="min-h-[3.5rem] max-w-40 border-x border-[#FA6C2F] px-1 !m-0 bg-[#FFF0E3] [--color:black] font-bold space-x-4 capitalize"
                id="click-trigger"
              >
                <div className="w-10 h-10 bg-slate-300 rounded-full grid place-items-center">AL</div>
                <span>Alex</span> <IonIcon className="text-[#FA6C2F] stroke w-4 h-4" icon={chevronDownOutline} />
              </IonButton>
              <IonPopover showBackdrop={false} trigger="click-trigger" triggerAction="click">
                <IonContent class="[--padding-top:0.5rem] [--padding-bottom:0.5rem]">
                  <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold hover:bg-slate-100 py-3 px-3 cursor-pointer active:bg-slate-200">
                    <IonIcon icon={logOut} /> Logout
                  </div>
                </IonContent>
              </IonPopover>
            </div>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <IonRouterOutlet>
            <Route path="/dashboard" render={() => <Redirect to="/dashboard/chart-of-account" />} exact={true} />
            <Route path="/dashboard/chart-of-account" render={() => <ChartOfAccount />} exact={true} />
            <Route path="/dashboard/center" render={() => <Center />} exact={true} />
            <Route path="/dashboard/client-master-file" render={() => <ClientMasterFile />} exact={true} />
            <Route path="/dashboard/client-master-file/new" render={() => <CreateClient />} exact={true} />
            <Route path="/dashboard/client-profile" render={() => <ClientProfile />} exact={true} />
            <Route path="/dashboard/loans" render={() => <Loans />} exact={true} />
            <Route path="/dashboard/bank" render={() => <Bank />} exact={true} />
            <Route path="/dashboard/weekly-saving-table" render={() => <WeeklySavingTable />} exact={true} />
            <Route path="/dashboard/supplier" render={() => <Supplier />} exact={true} />
            <Route path="/dashboard/business-type" render={() => <BusinessType />} exact={true} />
            <Route path="/dashboard/business-fix" render={() => <BusinessFix />} exact={true} />
            <Route path="/dashboard/nature" render={() => <Nature />} exact={true} />
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
