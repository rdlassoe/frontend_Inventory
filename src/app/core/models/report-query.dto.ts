export interface ReportQueryDto {
    period?: 'day' | 'week' | 'month' | 'year';
    startDate?: string; // Formato YYYY-MM-DD
    endDate?: string;   // Formato YYYY-MM-DD
    limit?: number;
}

export interface ComparisonQueryDto {
    startDate1: string;
    endDate1: string;
    startDate2: string;
    endDate2: string;
}