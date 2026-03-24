export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  NetWorth: undefined;
  Liabilities: { tab?: string } | undefined;
  CashFlow: undefined;
  Assets: undefined;
  Insurance: undefined;
  AIAdvisor: { tab?: string } | undefined;
  EntityDetail: { id: string };
  Setup: undefined;
};

export type DashboardTabParamList = {
  Combined: undefined;
  Business: undefined;
  Individual: undefined;
  Settings: undefined;
};
