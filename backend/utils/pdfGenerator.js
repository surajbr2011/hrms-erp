const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generateAttendanceReport = (data, res) => {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=attendance-report.pdf');

    doc.pipe(res);

    // Header Title
    doc.fontSize(20).text('Attendance Report', { align: 'center' });
    doc.moveDown();

    // Date created
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown(2);

    // The simplified layout for pdfkit table-like structure
    // Table Header
    const tableTop = doc.y;
    doc.font('Helvetica-Bold');
    doc.text('Employee Name', 50, tableTop);
    doc.text('Date', 200, tableTop);
    doc.text('Status', 300, tableTop);
    doc.text('Total Hrs', 400, tableTop);

    // Line under header
    doc.moveTo(50, tableTop + 15).lineTo(500, tableTop + 15).stroke();

    doc.font('Helvetica');
    let y = tableTop + 25;

    data.forEach(item => {
        // If getting close to page bottom, add new page
        if (y > 700) {
            doc.addPage();
            y = 50;
        }

        doc.text(item.user.name, 50, y);
        doc.text(new Date(item.date).toLocaleDateString(), 200, y);
        doc.text(item.status, 300, y);
        doc.text(item.totalHours ? item.totalHours.toFixed(2) : '0', 400, y);

        y += 20;
    });

    doc.end();
};

const generatePayrollReport = (payslips, res) => {
    const doc = new PDFDocument({ margin: 50 });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=payroll-report.pdf');

    doc.pipe(res);

    doc.fontSize(20).text('Payroll Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.moveDown(2);

    const tableTop = doc.y;
    doc.font('Helvetica-Bold');
    doc.text('Employee', 50, tableTop);
    doc.text('Month/Yr', 200, tableTop);
    doc.text('Net Salary', 350, tableTop);
    doc.text('Status', 450, tableTop);

    doc.moveTo(50, tableTop + 15).lineTo(500, tableTop + 15).stroke();

    doc.font('Helvetica');
    let y = tableTop + 25;

    payslips.forEach(item => {
        if (y > 700) {
            doc.addPage();
            y = 50;
        }
        const name = item.user && item.user.name ? item.user.name : 'Unknown';
        doc.text(name, 50, y);
        doc.text(`${item.month} ${item.year}`, 200, y);
        doc.text(`$${item.netSalary}`, 350, y);
        doc.text(item.status, 450, y);

        y += 20;
    });

    doc.end();
};

module.exports = {
    generateAttendanceReport,
    generatePayrollReport
};
