import {
  Developer,
  TimeLog,
  Project,
  Payslip,
  formatLocalDate,
  formatLocalTime,
  getClientTimezone
} from './developerService';

/**
 * Core utility that prints pure report HTML via an isolated hidden iframe.
 * Ensures the browser print engine renders ONLY the structured data report
 * without any surrounding webpage screenshot, dark backgrounds, or portal UI.
 */
export const printHtmlReport = (htmlContent: string) => {
  const iframe = document.createElement('iframe');
  iframe.setAttribute('style', 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden;');
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    if (iframe.parentNode) document.body.removeChild(iframe);
    return;
  }

  doc.open();
  doc.write(htmlContent);
  doc.close();

  const win = iframe.contentWindow;
  if (!win) {
    if (iframe.parentNode) document.body.removeChild(iframe);
    return;
  }

  const trigger = () => {
    try {
      win.focus();
      win.print();
    } catch (e) {
      console.error('Print execution failed:', e);
    } finally {
      setTimeout(() => {
        if (iframe.parentNode) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    }
  };

  if (doc.readyState === 'complete') {
    setTimeout(trigger, 250);
  } else {
    win.onload = () => setTimeout(trigger, 250);
  }
};

/**
 * Base CSS styles included in every report for clean, high-resolution vector printing.
 */
const getReportBaseCss = () => `
  @page {
    size: A4 portrait;
    margin: 14mm 14mm 14mm 14mm;
  }
  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    background: #ffffff !important;
    color: #0f172a !important;
    font-size: 11px;
    line-height: 1.45;
  }
  .report-container {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding-bottom: 14px;
    border-bottom: 2px solid #005696;
    margin-bottom: 14px;
  }
  .brand-title {
    font-size: 20px;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: #005696;
    margin: 0;
    text-transform: uppercase;
  }
  .brand-accent {
    color: #4d7c0f;
  }
  .brand-subtitle {
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #64748b;
    margin-top: 3px;
  }
  .report-meta-box {
    text-align: right;
  }
  .report-tag {
    display: inline-block;
    background: #f1f5f9;
    border: 1px solid #cbd5e1;
    color: #005696;
    padding: 3px 8px;
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 4px;
  }
  .report-timestamp {
    font-size: 9px;
    color: #64748b;
    margin-top: 4px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  }
  .context-grid {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 12px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 10px 14px;
    margin-bottom: 14px;
  }
  .context-item {
    font-size: 10px;
  }
  .context-label {
    font-size: 9px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .context-value {
    font-size: 11px;
    font-weight: 700;
    color: #0f172a;
    margin-top: 1px;
  }
  .metrics-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    margin-bottom: 16px;
  }
  .metric-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 8px 10px;
  }
  .metric-card-title {
    font-size: 9px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
  }
  .metric-card-val {
    font-size: 16px;
    font-weight: 900;
    color: #005696;
    margin-top: 2px;
  }
  .metric-card-sub {
    font-size: 9px;
    color: #64748b;
    font-weight: normal;
  }
  table.report-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 8px;
    font-size: 10px;
    page-break-inside: auto;
  }
  table.report-table tr {
    page-break-inside: avoid;
    page-break-after: auto;
  }
  table.report-table th {
    background: #f1f5f9;
    color: #1e293b;
    font-size: 9px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    padding: 7px 8px;
    border: 1px solid #cbd5e1;
    text-align: left;
  }
  table.report-table td {
    padding: 6px 8px;
    border: 1px solid #e2e8f0;
    vertical-align: top;
    line-height: 1.35;
  }
  table.report-table tbody tr:nth-child(even) {
    background: #fafafa;
  }
  .badge {
    display: inline-block;
    padding: 2px 6px;
    font-size: 8px;
    font-weight: 800;
    text-transform: uppercase;
    border-radius: 3px;
    letter-spacing: 0.05em;
  }
  .badge-success {
    background: #ecfdf5;
    color: #047857;
    border: 1px solid #a7f3d0;
  }
  .badge-active {
    background: #eff6ff;
    color: #1d4ed8;
    border: 1px solid #bfdbfe;
  }
  .badge-pending {
    background: #fffbeb;
    color: #b45309;
    border: 1px solid #fde68a;
  }
  .task-cell {
    word-break: break-word;
    white-space: normal;
    max-width: 260px;
  }
  .project-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 12px;
    margin-bottom: 12px;
    page-break-inside: avoid;
  }
  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 6px;
    margin-bottom: 8px;
  }
  .project-title {
    font-size: 13px;
    font-weight: 800;
    color: #0f172a;
    text-transform: uppercase;
  }
  .milestone-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 5px 8px;
    border-bottom: 1px dotted #e2e8f0;
    font-size: 10px;
  }
  .milestone-item:last-child {
    border-bottom: none;
  }
  .signoff-section {
    margin-top: 24px;
    padding-top: 14px;
    border-top: 1px solid #cbd5e1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    page-break-inside: avoid;
  }
  .sign-line {
    border-bottom: 1px solid #94a3b8;
    margin-top: 28px;
    margin-bottom: 4px;
  }
  .sign-label {
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    color: #475569;
  }
  .sign-sub {
    font-size: 8px;
    color: #94a3b8;
  }
  .footer {
    margin-top: 20px;
    padding-top: 8px;
    border-top: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    font-size: 8px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

/**
 * TAB 1: Print Time Logs / Attendance Report
 */
export const printTimeLogsReport = ({
  developer,
  timeLogs,
  metrics
}: {
  developer: Developer | null;
  timeLogs: TimeLog[];
  metrics?: {
    todayHours: number;
    weeklyHours: number;
    monthlyHours: number;
    lifetimeHours: number;
  };
}) => {
  const clientTz = getClientTimezone();
  const currentDate = new Date();
  const dateFormatted = formatLocalDate(currentDate.toISOString());
  const timeFormatted = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Compute totals
  const totalMinutes = timeLogs.reduce((acc, log) => acc + (log.totalMinutes || 0), 0);
  const totalHours = (totalMinutes / 60).toFixed(2);
  const activeCount = timeLogs.filter((l) => l.isActive).length;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>AMG_Time_Logs_Report_${developer?.name ? developer.name.replace(/\s+/g, '_') : 'Engineer'}</title>
        <style>${getReportBaseCss()}</style>
      </head>
      <body>
        <div class="report-container">
          <!-- Corporate Header -->
          <div class="header">
            <div>
              <h1 class="brand-title">AZARIAH <span class="brand-accent">MANAGEMENT GROUP</span></h1>
              <div class="brand-subtitle">Corporate Engineering & Operations • Official Shift Attendance Report</div>
            </div>
            <div class="report-meta-box">
              <div class="report-tag">Time Logs & Attendance</div>
              <div class="report-timestamp">Generated: ${dateFormatted} • ${timeFormatted} (${clientTz})</div>
            </div>
          </div>

          <!-- Personnel Context Box -->
          <div class="context-grid">
            <div class="context-item">
              <div class="context-label">Personnel / Engineer Details</div>
              <div class="context-value">${developer?.name || 'Engineer'}</div>
              <div style="color: #64748b; font-size: 9px; margin-top: 2px;">
                ${developer?.email || '—'} &bull; ${developer?.roleTitle || 'Full Stack Engineer'}
              </div>
            </div>
            <div class="context-item">
              <div class="context-label">Reporting Scope</div>
              <div class="context-value">${timeLogs.length} Logged Sessions (${totalHours} hrs)</div>
              <div style="color: #64748b; font-size: 9px; margin-top: 2px;">
                Status: ${activeCount > 0 ? `${activeCount} Session(s) Live` : 'All Sessions Completed'}
              </div>
            </div>
          </div>

          <!-- Metric KPI Summary Tiles -->
          <div class="metrics-row">
            <div class="metric-card">
              <div class="metric-card-title">Today's Hours</div>
              <div class="metric-card-val">${metrics?.todayHours ?? 0} <span class="metric-card-sub">hrs</span></div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">This Week</div>
              <div class="metric-card-val">${metrics?.weeklyHours ?? 0} <span class="metric-card-sub">hrs</span></div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">This Month</div>
              <div class="metric-card-val">${metrics?.monthlyHours ?? 0} <span class="metric-card-sub">hrs</span></div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">Lifetime Logged</div>
              <div class="metric-card-val">${metrics?.lifetimeHours ?? totalHours} <span class="metric-card-sub">hrs</span></div>
            </div>
          </div>

          <!-- Clean Data Table -->
          <table class="report-table">
            <thead>
              <tr>
                <th style="width: 14%;">Date</th>
                <th style="width: 20%;">Project</th>
                <th style="width: 12%;">Clock In</th>
                <th style="width: 12%;">Clock Out</th>
                <th style="width: 12%;">Duration</th>
                <th style="width: 22%;">Task Summary & Accomplishments</th>
                <th style="width: 8%; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${
                timeLogs.length === 0
                  ? `<tr><td colspan="7" style="text-align: center; padding: 24px; color: #94a3b8;">No logged sessions recorded for this developer account.</td></tr>`
                  : timeLogs
                      .map((log) => {
                        const dateStr = formatLocalDate(log.clockIn);
                        const inTime = formatLocalTime(log.clockIn, false);
                        const outTime = log.clockOut ? formatLocalTime(log.clockOut, false) : '—';
                        const durationStr = log.isActive ? 'Running live' : `${log.totalHours}h (${log.totalMinutes}m)`;
                        const statusBadge = log.isActive
                          ? `<span class="badge badge-active">Active</span>`
                          : `<span class="badge badge-success">Completed</span>`;

                        return `
                          <tr>
                            <td style="font-weight: 700; white-space: nowrap;">${dateStr}</td>
                            <td style="font-weight: 600; color: #005696;">${log.projectName || 'General Development'}</td>
                            <td style="font-family: monospace;">${inTime}</td>
                            <td style="font-family: monospace;">${outTime}</td>
                            <td style="font-weight: 700;">${durationStr}</td>
                            <td class="task-cell">${log.taskSummary || 'Engineering session complete.'}</td>
                            <td style="text-align: center;">${statusBadge}</td>
                          </tr>
                        `;
                      })
                      .join('')
              }
            </tbody>
          </table>

          <!-- Official Certification & Signoff Block -->
          <div class="signoff-section">
            <div>
              <div class="sign-label">Engineer Certification</div>
              <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">
                I hereby certify that the logged shift hours and task accomplishments accurately reflect actual services performed.
              </div>
              <div class="sign-line"></div>
              <div class="sign-label">${developer?.name || 'Engineer'}</div>
              <div class="sign-sub">Signature & Date</div>
            </div>
            <div>
              <div class="sign-label">Corporate Authorization</div>
              <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">
                Azariah Management Group Executive Leadership review and operational verification.
              </div>
              <div class="sign-line"></div>
              <div class="sign-label">Authorized Executive Signatory</div>
              <div class="sign-sub">AMG Operations Controller</div>
            </div>
          </div>

          <!-- Document Footer -->
          <div class="footer">
            <span>Azariah Management Group Inc. &bull; Confidential Internal Record</span>
            <span>Document ID: AMG-TIME-${developer?.id || '0'}-${currentDate.getTime().toString().slice(-6)}</span>
          </div>
        </div>
      </body>
    </html>
  `;

  printHtmlReport(html);
};

/**
 * TAB 2: Print Assigned Projects & Milestones Report
 */
export const printProjectsReport = ({
  developer,
  projects
}: {
  developer: Developer | null;
  projects: Project[];
}) => {
  const clientTz = getClientTimezone();
  const currentDate = new Date();
  const dateFormatted = formatLocalDate(currentDate.toISOString());
  const timeFormatted = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Calculate milestones stats
  let totalMilestones = 0;
  let completedMilestones = 0;
  projects.forEach((p) => {
    if (p.milestones) {
      totalMilestones += p.milestones.length;
      completedMilestones += p.milestones.filter((m) => m.status === 'completed').length;
    }
  });

  const launchedCount = projects.filter((p) => p.status === 'launched').length;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>AMG_Projects_Report_${developer?.name ? developer.name.replace(/\s+/g, '_') : 'Engineer'}</title>
        <style>${getReportBaseCss()}</style>
      </head>
      <body>
        <div class="report-container">
          <!-- Corporate Header -->
          <div class="header">
            <div>
              <h1 class="brand-title">AZARIAH <span class="brand-accent">MANAGEMENT GROUP</span></h1>
              <div class="brand-subtitle">Corporate Projects, Engineering Roadmaps & Milestones Status</div>
            </div>
            <div class="report-meta-box">
              <div class="report-tag">Projects & Milestones</div>
              <div class="report-timestamp">Generated: ${dateFormatted} • ${timeFormatted} (${clientTz})</div>
            </div>
          </div>

          <!-- Personnel Context Box -->
          <div class="context-grid">
            <div class="context-item">
              <div class="context-label">Assigned Engineer</div>
              <div class="context-value">${developer?.name || 'Engineer'}</div>
              <div style="color: #64748b; font-size: 9px; margin-top: 2px;">
                ${developer?.email || '—'} &bull; ${developer?.roleTitle || 'Developer'}
              </div>
            </div>
            <div class="context-item">
              <div class="context-label">Project Allocation</div>
              <div class="context-value">${projects.length} Assigned Project(s)</div>
              <div style="color: #64748b; font-size: 9px; margin-top: 2px;">
                ${totalMilestones} Total Milestones (${completedMilestones} Completed)
              </div>
            </div>
          </div>

          <!-- Metrics KPI Row -->
          <div class="metrics-row">
            <div class="metric-card">
              <div class="metric-card-title">Assigned Projects</div>
              <div class="metric-card-val">${projects.length}</div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">Launched Live</div>
              <div class="metric-card-val">${launchedCount}</div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">Total Milestones</div>
              <div class="metric-card-val">${totalMilestones}</div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">Milestones Completed</div>
              <div class="metric-card-val" style="color: #15803d;">${completedMilestones}</div>
            </div>
          </div>

          <!-- Projects List -->
          <div>
            ${
              projects.length === 0
                ? `<div style="text-align: center; padding: 30px; border: 1px solid #e2e8f0; border-radius: 6px; color: #94a3b8;">
                    No corporate projects have been assigned to this engineer yet.
                   </div>`
                : projects
                    .map((proj) => {
                      const statusBadge =
                        proj.status === 'launched'
                          ? `<span class="badge badge-success">Launched</span>`
                          : proj.status === 'in_progress'
                          ? `<span class="badge badge-active">In Progress</span>`
                          : `<span class="badge badge-pending">${proj.status.replace('_', ' ')}</span>`;

                      return `
                        <div class="project-card">
                          <div class="project-header">
                            <div>
                              <span class="project-title">${proj.name}</span>
                              <span style="margin-left: 8px;">${statusBadge}</span>
                            </div>
                            <div style="font-size: 9px; color: #64748b;">
                              ${proj.launchDate ? `<strong>Target Launch:</strong> ${proj.launchDate}` : ''}
                              ${proj.repoUrl ? `&bull; <strong>Repository:</strong> ${proj.repoUrl}` : ''}
                            </div>
                          </div>
                          ${
                            proj.description
                              ? `<p style="font-size: 9.5px; color: #475569; margin: 0 0 8px 0;">${proj.description}</p>`
                              : ''
                          }

                          <!-- Milestones Checklist Table -->
                          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 6px 10px;">
                            <div style="font-size: 9px; font-weight: 800; color: #475569; text-transform: uppercase; margin-bottom: 4px;">
                              Project Milestones & Deliverables (${proj.milestones?.length || 0})
                            </div>
                            ${
                              !proj.milestones || proj.milestones.length === 0
                                ? `<div style="font-size: 9px; color: #94a3b8;">No milestones defined for this project.</div>`
                                : proj.milestones
                                    .map((m) => {
                                      const isDone = m.status === 'completed';
                                      const mBadge = isDone
                                        ? `<span class="badge badge-success">&check; Completed</span>`
                                        : `<span class="badge badge-pending">Pending</span>`;
                                      return `
                                        <div class="milestone-item">
                                          <div>
                                            <strong style="color: ${isDone ? '#64748b' : '#0f172a'}; text-decoration: ${
                                        isDone ? 'line-through' : 'none'
                                      };">${m.title}</strong>
                                            ${
                                              m.description
                                                ? `<div style="font-size: 8.5px; color: #64748b;">${m.description}</div>`
                                                : ''
                                            }
                                          </div>
                                          <div style="text-align: right; white-space: nowrap; margin-left: 12px;">
                                            ${m.dueDate ? `<span style="font-size: 8px; color: #64748b; margin-right: 6px;">Due: ${m.dueDate}</span>` : ''}
                                            ${mBadge}
                                          </div>
                                        </div>
                                      `;
                                    })
                                    .join('')
                            }
                          </div>
                        </div>
                      `;
                    })
                    .join('')
            }
          </div>

          <!-- Official Signoff -->
          <div class="signoff-section">
            <div>
              <div class="sign-label">Project Lead Acknowledgement</div>
              <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">
                Verified deliverables and engineering progress status.
              </div>
              <div class="sign-line"></div>
              <div class="sign-label">${developer?.name || 'Engineer'}</div>
              <div class="sign-sub">Signature & Date</div>
            </div>
            <div>
              <div class="sign-label">AMG Technical Director</div>
              <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">
                Executive Engineering signoff and roadmap alignment.
              </div>
              <div class="sign-line"></div>
              <div class="sign-label">VP of Engineering & Product</div>
              <div class="sign-sub">Azariah Management Group</div>
            </div>
          </div>

          <!-- Document Footer -->
          <div class="footer">
            <span>Azariah Management Group Inc. &bull; Confidential Corporate Strategy</span>
            <span>Document ID: AMG-PROJ-${developer?.id || '0'}-${currentDate.getTime().toString().slice(-6)}</span>
          </div>
        </div>
      </body>
    </html>
  `;

  printHtmlReport(html);
};

/**
 * TAB 3: Print Payslips & Vouchers Statement Report
 */
export const printPayslipsReport = ({
  developer,
  payslips
}: {
  developer: Developer | null;
  payslips: Payslip[];
}) => {
  const clientTz = getClientTimezone();
  const currentDate = new Date();
  const dateFormatted = formatLocalDate(currentDate.toISOString());
  const timeFormatted = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Calculate totals
  const totalDisbursed = payslips.reduce((sum, p) => sum + Number(p.totalAmount || 0), 0);
  const totalHoursBilled = payslips.reduce((sum, p) => sum + Number(p.hoursBilled || 0), 0);
  const confirmedCount = payslips.filter((p) => p.status === 'confirmed').length;
  const currency = payslips[0]?.currency || developer?.currency || 'USD';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>AMG_Payroll_Statement_${developer?.name ? developer.name.replace(/\s+/g, '_') : 'Engineer'}</title>
        <style>${getReportBaseCss()}</style>
      </head>
      <body>
        <div class="report-container">
          <!-- Corporate Header -->
          <div class="header">
            <div>
              <h1 class="brand-title">AZARIAH <span class="brand-accent">MANAGEMENT GROUP</span></h1>
              <div class="brand-subtitle">Corporate Financial Operations • Payroll & Disbursements Statement</div>
            </div>
            <div class="report-meta-box">
              <div class="report-tag">Statement of Disbursements</div>
              <div class="report-timestamp">Generated: ${dateFormatted} • ${timeFormatted} (${clientTz})</div>
            </div>
          </div>

          <!-- Personnel Context Box -->
          <div class="context-grid">
            <div class="context-item">
              <div class="context-label">Engineer / Payee Details</div>
              <div class="context-value">${developer?.name || 'Engineer'}</div>
              <div style="color: #64748b; font-size: 9px; margin-top: 2px;">
                ${developer?.email || '—'} &bull; ${developer?.roleTitle || 'Developer'}
              </div>
            </div>
            <div class="context-item">
              <div class="context-label">Financial Account Overview</div>
              <div class="context-value">${currency} ${totalDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Net Paid</div>
              <div style="color: #64748b; font-size: 9px; margin-top: 2px;">
                ${payslips.length} Voucher(s) &bull; ${confirmedCount} Confirmed Receipts
              </div>
            </div>
          </div>

          <!-- Metrics KPI Row -->
          <div class="metrics-row">
            <div class="metric-card">
              <div class="metric-card-title">Total Disbursed Net</div>
              <div class="metric-card-val" style="color: #047857;">${currency} ${totalDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">Total Hours Billed</div>
              <div class="metric-card-val">${totalHoursBilled} <span class="metric-card-sub">hrs</span></div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">Issued Vouchers</div>
              <div class="metric-card-val">${payslips.length}</div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">Confirmed Receipts</div>
              <div class="metric-card-val" style="color: #005696;">${confirmedCount}</div>
            </div>
          </div>

          <!-- Statement Table -->
          <table class="report-table">
            <thead>
              <tr>
                <th style="width: 14%;">Voucher Ref</th>
                <th style="width: 20%;">Billing Window</th>
                <th style="width: 10%;">Hours Billed</th>
                <th style="width: 10%;">Hourly Rate</th>
                <th style="width: 14%; text-align: right;">Total Amount</th>
                <th style="width: 14%;">Method</th>
                <th style="width: 18%; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${
                payslips.length === 0
                  ? `<tr><td colspan="7" style="text-align: center; padding: 24px; color: #94a3b8;">No payroll disbursements or vouchers issued yet.</td></tr>`
                  : payslips
                      .map((ps) => {
                        const isConfirmed = ps.status === 'confirmed';
                        const badge = isConfirmed
                          ? `<span class="badge badge-success">&check; Confirmed</span>`
                          : `<span class="badge badge-pending">Pending Receipt</span>`;

                        return `
                          <tr>
                            <td style="font-weight: 800; font-family: monospace;">${ps.referenceNo}</td>
                            <td>${ps.periodStart} &rarr; ${ps.periodEnd}</td>
                            <td style="font-weight: 700;">${ps.hoursBilled} hrs</td>
                            <td>${ps.currency} ${Number(ps.hourlyRate).toFixed(2)}</td>
                            <td style="font-weight: 900; text-align: right; color: #047857;">
                              ${ps.currency} ${Number(ps.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td>${ps.paymentMethod}</td>
                            <td style="text-align: center;">
                              ${badge}
                              ${isConfirmed && ps.confirmedAt ? `<div style="font-size: 7.5px; color: #64748b; margin-top: 2px;">${formatLocalDate(ps.confirmedAt)}</div>` : ''}
                            </td>
                          </tr>
                        `;
                      })
                      .join('')
              }
            </tbody>
            <tfoot>
              <tr style="background: #f8fafc; font-weight: 800; border-top: 2px solid #cbd5e1;">
                <td colspan="4" style="text-align: right; text-transform: uppercase; padding: 8px;">Cumulative Total Paid:</td>
                <td style="text-align: right; color: #047857; font-size: 12px; padding: 8px;">
                  ${currency} ${totalDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>

          <!-- Signoff Section -->
          <div class="signoff-section">
            <div>
              <div class="sign-label">Payee Acknowledgment</div>
              <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">
                Confirmation of disbursed remuneration for professional technology services rendered.
              </div>
              <div class="sign-line"></div>
              <div class="sign-label">${developer?.name || 'Engineer'}</div>
              <div class="sign-sub">Payee Signature & Date</div>
            </div>
            <div>
              <div class="sign-label">Corporate Disbursement Officer</div>
              <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">
                Authorized corporate financial release & treasury oversight.
              </div>
              <div class="sign-line"></div>
              <div class="sign-label">Corporate Treasurer / Controller</div>
              <div class="sign-sub">Azariah Management Group Executive Treasury</div>
            </div>
          </div>

          <!-- Document Footer -->
          <div class="footer">
            <span>Azariah Management Group Inc. &bull; Corporate Financial Disbursement Statement</span>
            <span>Document ID: AMG-PAY-${developer?.id || '0'}-${currentDate.getTime().toString().slice(-6)}</span>
          </div>
        </div>
      </body>
    </html>
  `;

  printHtmlReport(html);
};

/**
 * INDIVIDUAL PAYSLIP: Print Official Single Voucher
 */
export const printSinglePayslipVoucher = ({
  developer,
  payslip
}: {
  developer: Developer | null;
  payslip: Payslip;
}) => {
  const dateFormatted = formatLocalDate(payslip.issuedAt);
  const isConfirmed = payslip.status === 'confirmed';

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>AMG_Voucher_${payslip.referenceNo}</title>
        <style>${getReportBaseCss()}</style>
      </head>
      <body>
        <div class="report-container" style="max-width: 680px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 8px; padding: 24px;">
          <!-- Corporate Header -->
          <div class="header">
            <div>
              <h1 class="brand-title">AZARIAH <span class="brand-accent">MANAGEMENT GROUP</span></h1>
              <div class="brand-subtitle">Corporate Financial Operations &bull; Engineering Disbursement Voucher</div>
            </div>
            <div class="report-meta-box">
              <div class="report-tag" style="background: #005696; color: #ffffff; border: none;">OFFICIAL VOUCHER</div>
              <div style="font-size: 13px; font-weight: 800; font-family: monospace; color: #0f172a; margin-top: 4px;">
                ${payslip.referenceNo}
              </div>
              <div class="report-timestamp">Issued Date: ${dateFormatted}</div>
            </div>
          </div>

          <!-- Details Matrix -->
          <div class="context-grid" style="margin-top: 14px;">
            <div class="context-item">
              <div class="context-label">Disbursed To</div>
              <div class="context-value" style="font-size: 13px;">${developer?.name || payslip.developerName || 'Engineer'}</div>
              <div style="color: #475569; font-size: 9.5px; margin-top: 2px;">
                ${developer?.email || payslip.developerEmail || '—'}
              </div>
              <div style="color: #005696; font-size: 9.5px; font-weight: 700; margin-top: 2px;">
                ${developer?.roleTitle || payslip.developerRole || 'Developer'}
              </div>
            </div>
            <div class="context-item" style="text-align: right;">
              <div class="context-label">Billing Period</div>
              <div class="context-value" style="font-size: 11px;">
                ${payslip.periodStart} &rarr; ${payslip.periodEnd}
              </div>
              <div class="context-label" style="margin-top: 6px;">Disbursement Method</div>
              <div class="context-value">${payslip.paymentMethod}</div>
            </div>
          </div>

          <!-- Itemized Calculation Table -->
          <table class="report-table" style="margin-top: 16px;">
            <thead>
              <tr>
                <th style="width: 50%;">Description</th>
                <th style="width: 15%; text-align: right;">Hours</th>
                <th style="width: 15%; text-align: right;">Rate</th>
                <th style="width: 20%; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="font-weight: 600;">Approved Engineering Services</td>
                <td style="text-align: right; font-weight: 700;">${payslip.hoursBilled} hrs</td>
                <td style="text-align: right;">${payslip.currency} ${Number(payslip.hourlyRate).toFixed(2)}</td>
                <td style="text-align: right; font-weight: 800;">
                  ${payslip.currency} ${(Number(payslip.hoursBilled) * Number(payslip.hourlyRate)).toFixed(2)}
                </td>
              </tr>
              ${
                Number(payslip.bonus) > 0
                  ? `
                    <tr>
                      <td style="color: #047857; font-weight: 600;">Performance Bonus / Milestone Incentive</td>
                      <td style="text-align: right;">—</td>
                      <td style="text-align: right;">—</td>
                      <td style="text-align: right; color: #047857; font-weight: 800;">
                        +${payslip.currency} ${Number(payslip.bonus).toFixed(2)}
                      </td>
                    </tr>
                  `
                  : ''
              }
              ${
                Number(payslip.deductions) > 0
                  ? `
                    <tr>
                      <td style="color: #b91c1c; font-weight: 600;">Withholdings / Deductions</td>
                      <td style="text-align: right;">—</td>
                      <td style="text-align: right;">—</td>
                      <td style="text-align: right; color: #b91c1c; font-weight: 800;">
                        -${payslip.currency} ${Number(payslip.deductions).toFixed(2)}
                      </td>
                    </tr>
                  `
                  : ''
              }
            </tbody>
            <tfoot>
              <tr style="background: #f8fafc; border-top: 2px solid #005696;">
                <td colspan="3" style="text-align: right; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 10px;">
                  Total Disbursed Net:
                </td>
                <td style="text-align: right; font-size: 15px; font-weight: 900; color: #047857; font-family: monospace; padding: 10px;">
                  ${payslip.currency} ${Number(payslip.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>

          ${
            payslip.notes
              ? `
                <div style="margin-top: 14px; padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; font-size: 9.5px; color: #475569;">
                  <strong>Voucher Memo:</strong> ${payslip.notes}
                </div>
              `
              : ''
          }

          <!-- Status & Signatures -->
          <div class="signoff-section" style="margin-top: 20px;">
            <div>
              <div class="sign-label">Disbursement Status</div>
              <div style="margin-top: 4px;">
                ${
                  isConfirmed
                    ? `<span class="badge badge-success" style="font-size: 9px; padding: 3px 8px;">&check; Confirmed Receipt by Payee</span>
                       <div style="font-size: 8.5px; color: #64748b; margin-top: 4px;">
                         Confirmed on ${payslip.confirmedAt ? formatLocalDate(payslip.confirmedAt) : 'Recorded'}
                       </div>`
                    : `<span class="badge badge-pending" style="font-size: 9px; padding: 3px 8px;">Pending Developer Receipt Confirmation</span>`
                }
              </div>
            </div>
            <div style="text-align: right;">
              <div style="width: 160px; border-bottom: 1px solid #0f172a; margin-left: auto; margin-top: 24px; margin-bottom: 4px;"></div>
              <div class="sign-label">Authorized Executive Signatory</div>
              <div class="sign-sub">Azariah Management Group Executive</div>
            </div>
          </div>

          <div class="footer" style="margin-top: 24px;">
            <span>Azariah Management Group Inc. &bull; Official Disbursement Record</span>
            <span>Voucher Ref: ${payslip.referenceNo}</span>
          </div>
        </div>
      </body>
    </html>
  `;

  printHtmlReport(html);
};

/**
 * ADMIN: Print Master Time Tracking & Attendance Report
 */
export const printAdminTimeTrackingReport = ({
  logs,
  metrics,
  selectedDevName,
  selectedProjectName,
  startDate,
  endDate
}: {
  logs: TimeLog[];
  metrics: {
    totalLogs: number;
    totalHours: number;
    activeDevelopersCount: number;
  };
  selectedDevName?: string;
  selectedProjectName?: string;
  startDate?: string;
  endDate?: string;
}) => {
  const clientTz = getClientTimezone();
  const currentDate = new Date();
  const dateFormatted = formatLocalDate(currentDate.toISOString());
  const timeFormatted = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const filterSummary = [
    selectedDevName ? `Developer: ${selectedDevName}` : 'All Developers',
    selectedProjectName ? `Project: ${selectedProjectName}` : 'All Projects',
    startDate || endDate ? `Period: ${startDate || 'Start'} to ${endDate || 'Present'}` : 'All Historical Logs'
  ].join(' • ');

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>AMG_Admin_Time_Tracking_Report</title>
        <style>${getReportBaseCss()}</style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <div>
              <h1 class="brand-title">AZARIAH <span class="brand-accent">MANAGEMENT GROUP</span></h1>
              <div class="brand-subtitle">Executive Operations &bull; Master Engineering Attendance & Shift Records</div>
            </div>
            <div class="report-meta-box">
              <div class="report-tag">Master Attendance Audit</div>
              <div class="report-timestamp">Generated: ${dateFormatted} • ${timeFormatted} (${clientTz})</div>
            </div>
          </div>

          <div class="context-grid">
            <div class="context-item">
              <div class="context-label">Audit Parameters</div>
              <div class="context-value">${filterSummary}</div>
            </div>
            <div class="context-item">
              <div class="context-label">Records Selected</div>
              <div class="context-value">${logs.length} Logged Session(s)</div>
            </div>
          </div>

          <div class="metrics-row">
            <div class="metric-card">
              <div class="metric-card-title">Total Logged Hours</div>
              <div class="metric-card-val">${metrics.totalHours} <span class="metric-card-sub">hrs</span></div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">Total Shift Sessions</div>
              <div class="metric-card-val">${metrics.totalLogs}</div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">Active Right Now</div>
              <div class="metric-card-val" style="color: #047857;">${metrics.activeDevelopersCount}</div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">Average Session</div>
              <div class="metric-card-val">${logs.length > 0 ? (metrics.totalHours / logs.length).toFixed(1) : 0} <span class="metric-card-sub">hrs</span></div>
            </div>
          </div>

          <table class="report-table">
            <thead>
              <tr>
                <th style="width: 13%;">Date</th>
                <th style="width: 17%;">Developer</th>
                <th style="width: 18%;">Project</th>
                <th style="width: 10%;">Clock In</th>
                <th style="width: 10%;">Clock Out</th>
                <th style="width: 10%;">Duration</th>
                <th style="width: 16%;">Task Summary</th>
                <th style="width: 6%; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${
                logs.length === 0
                  ? `<tr><td colspan="8" style="text-align: center; padding: 24px; color: #94a3b8;">No matching time logs found.</td></tr>`
                  : logs
                      .map((log) => {
                        const dateStr = formatLocalDate(log.clockIn);
                        const inTime = formatLocalTime(log.clockIn, false);
                        const outTime = log.clockOut ? formatLocalTime(log.clockOut, false) : '—';
                        const durStr = log.isActive ? 'Active' : `${log.totalHours}h (${log.totalMinutes}m)`;
                        const statusBadge = log.isActive
                          ? `<span class="badge badge-active">Live</span>`
                          : `<span class="badge badge-success">Done</span>`;

                        return `
                          <tr>
                            <td style="font-weight: 700; white-space: nowrap;">${dateStr}</td>
                            <td style="font-weight: 600;">${log.developerName || 'Engineer'}</td>
                            <td style="color: #005696;">${log.projectName || 'General Development'}</td>
                            <td style="font-family: monospace;">${inTime}</td>
                            <td style="font-family: monospace;">${outTime}</td>
                            <td style="font-weight: 700;">${durStr}</td>
                            <td class="task-cell">${log.taskSummary || 'Session complete.'}</td>
                            <td style="text-align: center;">${statusBadge}</td>
                          </tr>
                        `;
                      })
                      .join('')
              }
            </tbody>
          </table>

          <div class="signoff-section">
            <div>
              <div class="sign-label">Audited By</div>
              <div class="sign-line"></div>
              <div class="sign-label">AMG Technical Operations Lead</div>
              <div class="sign-sub">Signature & Date</div>
            </div>
            <div>
              <div class="sign-label">Controller Signoff</div>
              <div class="sign-line"></div>
              <div class="sign-label">Corporate Managing Partner</div>
              <div class="sign-sub">Azariah Management Group Executive</div>
            </div>
          </div>

          <div class="footer">
            <span>Azariah Management Group Inc. &bull; Master Operations Audit</span>
            <span>Document ID: AMG-ADMIN-TIME-${currentDate.getTime().toString().slice(-6)}</span>
          </div>
        </div>
      </body>
    </html>
  `;

  printHtmlReport(html);
};

/**
 * ADMIN: Print Master Payroll & Disbursements Report
 */
export const printAdminPayrollReport = ({
  payslips,
  stats
}: {
  payslips: Payslip[];
  stats?: {
    totalIssued: number;
    totalAmount: number;
    confirmedCount: number;
    pendingCount: number;
  };
}) => {
  const clientTz = getClientTimezone();
  const currentDate = new Date();
  const dateFormatted = formatLocalDate(currentDate.toISOString());
  const timeFormatted = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const totalAmount = stats?.totalAmount ?? payslips.reduce((s, p) => s + Number(p.totalAmount || 0), 0);
  const confirmed = stats?.confirmedCount ?? payslips.filter((p) => p.status === 'confirmed').length;
  const pending = stats?.pendingCount ?? payslips.filter((p) => p.status !== 'confirmed').length;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>AMG_Admin_Payroll_Disbursements_Report</title>
        <style>${getReportBaseCss()}</style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <div>
              <h1 class="brand-title">AZARIAH <span class="brand-accent">MANAGEMENT GROUP</span></h1>
              <div class="brand-subtitle">Executive Treasury &bull; Master Payroll Disbursements & Vouchers Audit</div>
            </div>
            <div class="report-meta-box">
              <div class="report-tag">Master Payroll Statement</div>
              <div class="report-timestamp">Generated: ${dateFormatted} • ${timeFormatted} (${clientTz})</div>
            </div>
          </div>

          <div class="context-grid">
            <div class="context-item">
              <div class="context-label">Treasury Overview</div>
              <div class="context-value">${payslips.length} Disbursed Vouchers</div>
              <div style="color: #64748b; font-size: 9px; margin-top: 2px;">
                ${confirmed} Confirmed Receipts &bull; ${pending} Pending Acknowledgment
              </div>
            </div>
            <div class="context-item">
              <div class="context-label">Total Treasury Outflow</div>
              <div class="context-value" style="color: #047857;">
                $${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div class="metrics-row">
            <div class="metric-card">
              <div class="metric-card-title">Total Disbursed</div>
              <div class="metric-card-val" style="color: #047857;">$${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">Vouchers Issued</div>
              <div class="metric-card-val">${payslips.length}</div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">Receipts Confirmed</div>
              <div class="metric-card-val" style="color: #005696;">${confirmed}</div>
            </div>
            <div class="metric-card">
              <div class="metric-card-title">Pending Receipt</div>
              <div class="metric-card-val" style="color: #b45309;">${pending}</div>
            </div>
          </div>

          <table class="report-table">
            <thead>
              <tr>
                <th style="width: 14%;">Voucher Ref</th>
                <th style="width: 18%;">Developer</th>
                <th style="width: 18%;">Billing Window</th>
                <th style="width: 10%;">Hours</th>
                <th style="width: 14%; text-align: right;">Total Amount</th>
                <th style="width: 12%;">Method</th>
                <th style="width: 14%; text-align: center;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${
                payslips.length === 0
                  ? `<tr><td colspan="7" style="text-align: center; padding: 24px; color: #94a3b8;">No payroll records found.</td></tr>`
                  : payslips
                      .map((ps) => {
                        const isConfirmed = ps.status === 'confirmed';
                        const badge = isConfirmed
                          ? `<span class="badge badge-success">&check; Confirmed</span>`
                          : `<span class="badge badge-pending">Pending</span>`;

                        return `
                          <tr>
                            <td style="font-weight: 800; font-family: monospace;">${ps.referenceNo}</td>
                            <td style="font-weight: 600;">${ps.developerName || 'Engineer'}</td>
                            <td>${ps.periodStart} &rarr; ${ps.periodEnd}</td>
                            <td style="font-weight: 700;">${ps.hoursBilled} hrs</td>
                            <td style="font-weight: 900; text-align: right; color: #047857;">
                              ${ps.currency} ${Number(ps.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td>${ps.paymentMethod}</td>
                            <td style="text-align: center;">${badge}</td>
                          </tr>
                        `;
                      })
                      .join('')
              }
            </tbody>
            <tfoot>
              <tr style="background: #f8fafc; font-weight: 800; border-top: 2px solid #cbd5e1;">
                <td colspan="4" style="text-align: right; text-transform: uppercase; padding: 8px;">Master Disbursed Outflow:</td>
                <td style="text-align: right; color: #047857; font-size: 12px; padding: 8px;">
                  $${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
                <td colspan="2"></td>
              </tr>
            </tfoot>
          </table>

          <div class="signoff-section">
            <div>
              <div class="sign-label">Prepared By</div>
              <div class="sign-line"></div>
              <div class="sign-label">Treasury Disbursement Specialist</div>
              <div class="sign-sub">Signature & Date</div>
            </div>
            <div>
              <div class="sign-label">Authorized Chief Financial Officer</div>
              <div class="sign-line"></div>
              <div class="sign-label">Azariah Management Group Executive Treasury</div>
              <div class="sign-sub">Final Corporate Authorization</div>
            </div>
          </div>

          <div class="footer">
            <span>Azariah Management Group Inc. &bull; Confidential Executive Treasury Audit</span>
            <span>Document ID: AMG-ADMIN-PAY-${currentDate.getTime().toString().slice(-6)}</span>
          </div>
        </div>
      </body>
    </html>
  `;

  printHtmlReport(html);
};
