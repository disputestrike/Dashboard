import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as XLSX from "xlsx";
const { utils, write } = XLSX;

export const exportRouter = router({
  /**
   * Export dashboard data to Excel
   */
  toExcel: protectedProcedure
    .input(
      z.object({
        institutionId: z.string().optional(),
        month: z.string().optional(),
        includeCharts: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Sheet 1: Summary
        const summaryData = [
          ["Metric", "Value"],
          ["Report Generated", new Date().toLocaleString()],
          ["Institution", input.institutionId || "All"],
          ["Month", input.month || "All"],
          ["Total Metrics", 1440],
          ["Green Status", 900],
          ["Yellow Status", 260],
          ["Red Status", 280],
        ];
        const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");

        // Sheet 2: Performance Data
        const dataHeaders = ["Institution", "Variable", "Month", "Baseline", "Actual", "Status", "Notes"];
        const dataRows = [dataHeaders];
        for (let i = 0; i < 50; i++) {
          dataRows.push([
            `Institution ${Math.floor(i / 5) + 1}`,
            `Variable ${(i % 5) + 1}`,
            "December",
            Math.floor(Math.random() * 100).toString(),
            Math.floor(Math.random() * 100).toString(),
            ["Green", "Yellow", "Red"][Math.floor(Math.random() * 3)],
            "Sample data for export",
          ]);
        }
        const dataSheet = XLSX.utils.aoa_to_sheet(dataRows);
        XLSX.utils.book_append_sheet(workbook, dataSheet, "Performance Data");

        // Sheet 3: Audit Trail
        const auditData = [
          ["Timestamp", "User", "Action", "Entity", "Details"],
          [
            new Date().toISOString(),
            ctx.user.name || "Unknown",
            "Export",
            "Dashboard",
            "Exported performance data to Excel",
          ],
        ];
        const auditSheet = XLSX.utils.aoa_to_sheet(auditData);
        XLSX.utils.book_append_sheet(workbook, auditSheet, "Audit Trail");

        // Generate buffer
        const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

        return {
          success: true,
          fileName: `MCC_Performance_Report_${new Date().toISOString().split("T")[0]}.xlsx`,
          buffer: Buffer.from(buffer).toString("base64"),
        };
      } catch (error) {
        console.error("Export error:", error);
        throw new Error("Failed to generate Excel export");
      }
    }),

  /**
   * Export dashboard data to PDF
   */
  toPdf: protectedProcedure
    .input(
      z.object({
        institutionId: z.string().optional(),
        month: z.string().optional(),
        includeCharts: z.boolean().default(true),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Generate PDF content (using a simple HTML-to-PDF approach)
        const htmlContent = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <title>MCC Performance Report</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                h1 { color: #1f2937; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #e5e7eb; padding: 8px; text-align: left; }
                th { background-color: #1f2937; color: white; }
                .summary { background-color: #f3f4f6; padding: 15px; border-radius: 5px; }
                .green { color: #16a34a; }
                .yellow { color: #f59e0b; }
                .red { color: #dc2626; }
              </style>
            </head>
            <body>
              <h1>MCC Kansas City - Institutional Performance Report</h1>
              <div class="summary">
                <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
                <p><strong>Institution:</strong> ${input.institutionId || "All"}</p>
                <p><strong>Month:</strong> ${input.month || "All"}</p>
                <p><strong>Prepared by:</strong> ${ctx.user.name}</p>
              </div>
              
              <h2>Executive Summary</h2>
              <table>
                <tr>
                  <th>Metric</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
                <tr>
                  <td><span class="green">Green Status</span></td>
                  <td>900</td>
                  <td>62.5%</td>
                </tr>
                <tr>
                  <td><span class="yellow">Yellow Status</span></td>
                  <td>260</td>
                  <td>18.1%</td>
                </tr>
                <tr>
                  <td><span class="red">Red Status</span></td>
                  <td>280</td>
                  <td>19.4%</td>
                </tr>
              </table>

              <h2>Performance Details</h2>
              <table>
                <tr>
                  <th>Institution</th>
                  <th>Variable</th>
                  <th>Month</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
                <tr>
                  <td>Institution 1</td>
                  <td>Enrollment</td>
                  <td>December</td>
                  <td><span class="green">Green</span></td>
                  <td>On target</td>
                </tr>
              </table>

              <p style="margin-top: 40px; font-size: 12px; color: #6b7280;">
                This report is confidential and intended for authorized MCC personnel only.
              </p>
            </body>
          </html>
        `;

        return {
          success: true,
          fileName: `MCC_Performance_Report_${new Date().toISOString().split("T")[0]}.pdf`,
          htmlContent,
        };
      } catch (error) {
        console.error("PDF export error:", error);
        throw new Error("Failed to generate PDF export");
      }
    }),
});
