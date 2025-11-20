import axiosInstance from './axiosInstance';
import { ApiWrapper, QueryBuilder } from './utilities';
import { DashboardPeriod, DashboardScope, DashboardResponse } from 'types/statistic.type';

const statisticApi = {
    getDashboardStats: async (
        period: DashboardPeriod = DashboardPeriod.SEVEN_DAYS,
        scope: DashboardScope = DashboardScope.HYBRID
    ): Promise<DashboardResponse> => {
        const queryString = QueryBuilder.build({ period, scope });
        return ApiWrapper.execute<DashboardResponse>(() =>
            axiosInstance.get<any>(`/statistics/dashboard${queryString}`)
        );
    },
};

export default statisticApi;
