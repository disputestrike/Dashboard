import axios, { AxiosInstance } from 'axios';
import { ENV } from './_core/env';

/**
 * Smartsheet API Service
 * Handles all communication with Smartsheet API for fetching and updating institutional data
 */
export class SmartsheetService {
  private client: AxiosInstance;
  private baseUrl = 'https://api.smartsheet.com/2.0';

  constructor() {
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${ENV.smartsheetApiToken}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  /**
   * Fetch all institutions from Smartsheet
   */
  async getInstitutions() {
    try {
      const response = await this.client.get(`/sheets/${ENV.smartsheetInstitutionsSheetId}`);
      return this.parseSheetData(response.data);
    } catch (error) {
      console.error('Error fetching institutions from Smartsheet:', error);
      throw new Error('Failed to fetch institutions from Smartsheet');
    }
  }

  /**
   * Fetch all performance variables from Smartsheet
   */
  async getPerformanceVariables() {
    try {
      const response = await this.client.get(`/sheets/${ENV.smartsheetVariablesSheetId}`);
      return this.parseSheetData(response.data);
    } catch (error) {
      console.error('Error fetching variables from Smartsheet:', error);
      throw new Error('Failed to fetch variables from Smartsheet');
    }
  }

  /**
   * Fetch performance data for a specific month
   */
  async getPerformanceData(month?: string, year?: number) {
    try {
      const response = await this.client.get(`/sheets/${ENV.smartsheetPerformanceDataSheetId}`);
      let data = this.parseSheetData(response.data);

      if (month || year) {
        data = data.filter((row: any) => {
          if (month && row.month !== month) return false;
          if (year && row.year !== year) return false;
          return true;
        });
      }

      return data;
    } catch (error) {
      console.error('Error fetching performance data from Smartsheet:', error);
      throw new Error('Failed to fetch performance data from Smartsheet');
    }
  }

  /**
   * Submit/update performance data in Smartsheet
   */
  async submitPerformanceData(data: {
    institutionId: string;
    variableId: string;
    month: string;
    year: number;
    baselineValue: string;
    actualValue: string;
    status: 'Green' | 'Yellow' | 'Red';
    notes?: string;
  }) {
    try {
      const response = await this.client.post(
        `/sheets/${ENV.smartsheetPerformanceDataSheetId}/rows`,
        {
          toBottom: true,
          cells: [
            { columnId: 1, value: data.institutionId },
            { columnId: 2, value: data.variableId },
            { columnId: 3, value: data.month },
            { columnId: 4, value: data.year },
            { columnId: 5, value: data.baselineValue },
            { columnId: 6, value: data.actualValue },
            { columnId: 7, value: data.status },
            { columnId: 8, value: data.notes || '' },
          ],
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error submitting performance data to Smartsheet:', error);
      throw new Error('Failed to submit performance data to Smartsheet');
    }
  }

  /**
   * Parse Smartsheet sheet data into structured format
   */
  private parseSheetData(sheet: any): Record<string, any>[] {
    if (!sheet.rows || sheet.rows.length === 0) {
      return [];
    }

    const columns = sheet.columns || [];
    const columnMap = new Map(columns.map((col: any) => [col.id, col.title]));

    return sheet.rows.map((row: any) => {
      const record: Record<string, any> = {};
      row.cells.forEach((cell: any) => {
        const columnName = columnMap.get(cell.columnId);
        if (columnName) {
          const key = String(columnName);
          record[key] = cell.value;
        }
      });
      return record;
    });
  }

  /**
   * Test connection to Smartsheet API
   */
  async testConnection() {
    try {
      const response = await this.client.get('/user/me');
      return {
        success: true,
        user: response.data.name,
        email: response.data.email,
      };
    } catch (error) {
      console.error('Smartsheet connection test failed:', error);
      return {
        success: false,
        error: 'Failed to connect to Smartsheet API',
      };
    }
  }
}

export const smartsheetService = new SmartsheetService();
