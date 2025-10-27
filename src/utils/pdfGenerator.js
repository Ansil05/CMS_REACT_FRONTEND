import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateBillPDF = (bill, patient, appointment) => {
  const doc = new jsPDF();
  
  // Hospital Header - Blue background
  doc.setFillColor(33, 150, 243);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('FAITH MULTI SPECIALITY HOSPITAL', 105, 15, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('123 Medical District, Chennai - 600001', 105, 22, { align: 'center' });
  doc.text('☎ +91-44-12345678 | ✉ info@faithhospital.com', 105, 28, { align: 'center' });
  doc.text('🌐 www.faithhospital.com', 105, 34, { align: 'center' });
  
  doc.setTextColor(0, 0, 0);
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', 105, 50, { align: 'center' });
  
  // Bill Details Box
  doc.setDrawColor(33, 150, 243);
  doc.setLineWidth(0.5);
  doc.rect(15, 55, 180, 20);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill No:', 20, 62);
  doc.text('Date:', 20, 69);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`#${bill.bill_id || 'BILL' + Date.now()}`, 50, 62);
  doc.text(new Date().toLocaleDateString('en-IN'), 50, 69);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Payment:', 120, 62);
  doc.text('Status:', 120, 69);
  
  doc.setFont('helvetica', 'normal');
  doc.text(bill.payment_mode || 'Cash', 160, 62);
  doc.setTextColor(34, 197, 94);
  doc.text('PAID', 160, 69);
  doc.setTextColor(0, 0, 0);
  
  // Patient Info
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Patient Information', 15, 85);
  
  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.rect(15, 88, 180, 30);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Name:', 20, 95);
  doc.text('Patient ID:', 20, 102);
  doc.text('Age:', 20, 109);
  doc.text('Phone:', 20, 116);
  
  doc.setFont('helvetica', 'normal');
  doc.text(`${patient.first_name} ${patient.last_name}`, 60, 95);
  doc.text(`#${patient.Patient_id}`, 60, 102);
  doc.text(`${patient.age || 'N/A'} years`, 60, 109);
  doc.text(patient.phone_no, 60, 116);
  
  doc.setFont('helvetica', 'bold');
  doc.text('Gender:', 120, 95);
  doc.text('Blood Group:', 120, 102);
  doc.text('Email:', 120, 109);
  
  doc.setFont('helvetica', 'normal');
  doc.text(patient.gender, 155, 95);
  doc.text(patient.blood_group || 'N/A', 155, 102);
  doc.text(patient.email, 155, 109);
  
  // Appointment Details
  if (appointment) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Appointment Details', 15, 128);
    
    doc.setDrawColor(200, 200, 200);
    doc.rect(15, 131, 180, 20);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor:', 20, 138);
    doc.text('Department:', 20, 145);
    
    doc.setFont('helvetica', 'normal');
    doc.text(appointment.doctor_name || 'Dr. Assigned', 60, 138);
    doc.text(appointment.department || 'General', 60, 145);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Date:', 120, 138);
    doc.text('Time:', 120, 145);
    
    doc.setFont('helvetica', 'normal');
    doc.text(new Date(appointment.appointment_date).toLocaleDateString('en-IN'), 155, 138);
    doc.text(appointment.appointment_time, 155, 145);
  }
  
  // Billing Table
  const tableY = appointment ? 165 : 139;
  
  doc.autoTable({
    startY: tableY,
    head: [['Service Description', 'Amount (₹)']],
    body: [
      ['Registration Fee', parseFloat(bill.reg_fee || 0).toFixed(2)],
      ['Consultation Fee', parseFloat(bill.doc_fee || 0).toFixed(2)],
    ],
    foot: [['Total Amount', (parseFloat(bill.reg_fee || 0) + parseFloat(bill.doc_fee || 0)).toFixed(2)]],
    theme: 'grid',
    headStyles: { fillColor: [33, 150, 243], textColor: [255, 255, 255], fontStyle: 'bold' },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 11 },
    columnStyles: {
      0: { fontStyle: 'bold', halign: 'left' },
      1: { halign: 'right' },
    },
  });
  
  // Token Number
  if (appointment && appointment.token_no) {
    const tokenY = doc.lastAutoTable.finalY + 15;
    doc.setDrawColor(33, 150, 243);
    doc.setLineWidth(1);
    doc.rect(70, tokenY, 70, 20);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TOKEN NUMBER', 105, tokenY + 8, { align: 'center' });
    doc.setFontSize(16);
    doc.setTextColor(33, 150, 243);
    doc.text(appointment.token_no, 105, tokenY + 16, { align: 'center' });
    doc.setTextColor(0, 0, 0);
  }
  
  // Footer
  const footerY = doc.internal.pageSize.height - 40;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(33, 150, 243);
  doc.text('Thank you for choosing Faith Multi Speciality Hospital!', 105, footerY, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text('💙 Get Well Soon! 💙', 105, footerY + 6, { align: 'center' });
  
  // Terms
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Terms & Conditions:', 15, footerY + 15);
  doc.text('1. This is a computer-generated bill and does not require a signature.', 15, footerY + 20);
  doc.text('2. Please retain this receipt for future reference.', 15, footerY + 24);
  doc.text('3. In case of any discrepancy, please contact reception within 24 hours.', 15, footerY + 28);
  
  // Save
  const fileName = `Bill_${bill.bill_id || Date.now()}_${patient.first_name}_${patient.last_name}.pdf`;
  doc.save(fileName);
};
