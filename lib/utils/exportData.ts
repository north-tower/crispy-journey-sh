// utils/exportData.ts
export async function exportSalesReport(timeRange: string) {
  try {
    const data = await generateSalesReport(timeRange);
    downloadCSV(data, `sales-report-${timeRange}-days`);
  } catch (error) {
    console.error("Error exporting sales report:", error);
    throw error;
  }
}

function generateSalesReport(timeRange: string) {

  console.log(timeRange)
  // Mock data generation - replace with actual data fetching
  return {
    headers: ["Date", "Revenue", "Orders", "Customers", "Average Order Value"],
    rows: [
      ["2024-02-20", "1250.00", "10", "8", "125.00"],
      ["2024-02-21", "1500.00", "12", "10", "125.00"],
      // Add more rows
    ],
  };
}

function downloadCSV(
  data: { headers: string[]; rows: string[][] },
  filename: string
) {
  const csvContent = [
    data.headers.join(","),
    ...data.rows.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
