export function exportDashboardConfig({ widgets, theme }) {
  const data = {
    version: 1,
    exportedAt: new Date().toISOString(),
    dashboard: {
      widgets,
      theme,
    },
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `dashboard-backup-${Date.now()}.json`;
  a.click();

  URL.revokeObjectURL(url);
}

export async function importDashboardConfig(file) {
  const text = await file.text();
  const parsed = JSON.parse(text);

  if (!parsed.version || !parsed.dashboard?.widgets) {
    throw new Error("Invalid dashboard configuration file");
  }

  return parsed.dashboard;
}