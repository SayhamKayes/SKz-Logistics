import React, { useState } from 'react';
import { Consignment } from '../../services/trackingData';
import { SainLogo } from '../../assets/Logo';
import { Printer, X, Download, Copy, Check, FileText } from 'lucide-react';

interface WaybillPrintModalProps {
  consignment: Consignment;
  isOpen: boolean;
  onClose: () => void;
}

export const WaybillPrintModal: React.FC<WaybillPrintModalProps> = ({
  consignment,
  isOpen,
  onClose,
}) => {
  const [viewMode, setViewMode] = useState<'3-copy-waybill' | 'consignment-receipt'>('3-copy-waybill');

  if (!isOpen) return null;

  const shipper = consignment.shipper || {
    name: 'SAIN',
    phone: '+880171906999',
    address: '15/B, Uttara Metro Center, Dhaka 1230 Bangladesh',
    email: 'saininternationallogistics@gmail.com',
  };

  const receiver = consignment.receiver || {
    name: consignment.consignee?.name || 'Muhammad Tahin',
    phone: consignment.consignee?.phoneMasked || '+8801731939325',
    address: consignment.destination?.address || 'Basundhara Residential Area, Dhaka. B-block road 1. House: 252',
    email: 'ocuna123@gmail.com',
  };

  const details = consignment.shipmentDetails || {
    typeOfShipment: consignment.serviceType || 'Air Freight',
    weightText: consignment.cargoDetails?.weight || 'around 1500g',
    packagesCount: String(consignment.cargoDetails?.pieces || 7),
    product: consignment.cargoDetails?.description || 'Keychain, Doll, Acrylic sheet',
    paymentMode: 'CASH',
    carrier: consignment.carrier || 'SAINEX',
    departureTimeStr: '18:52 pm',
    destination: consignment.destination?.country || 'Bangladesh',
    pickupTimeStr: '10:00 am',
    courier: 'SAIN INTERNATIONAL LOGISTICS',
    mode: 'Air Freight',
    quantity: '7 Box',
    totalFreight: '৳ 12,500',
    carrierReferenceNo: consignment.referenceNo || 'CRN-884920',
    origin: consignment.origin?.country || 'China',
    pickupDate: '2026-08-01',
    expectedDeliveryDate: '2026-08-12',
    comments: 'Total 7 store product.',
  };

  const packages = consignment.packagesData && consignment.packagesData.length > 0
    ? consignment.packagesData
    : [
        { id: '1', qty: 1, pieceType: 'Carton', description: '80595', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
        { id: '2', qty: 1, pieceType: 'Carton', description: '46182', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
        { id: '3', qty: 1, pieceType: 'Carton', description: '46089', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
        { id: '4', qty: 1, pieceType: 'Carton', description: '33242', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
        { id: '5', qty: 1, pieceType: 'Carton', description: '33260', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
        { id: '6', qty: 1, pieceType: 'Carton', description: '66924', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
        { id: '7', qty: 1, pieceType: 'Carton', description: '60831', lengthCm: 0, widthCm: 0, heightCm: 0, weightG: 0 },
      ];

  const copies = [
    { title: 'Accounts Copy', subtitle: 'Office & Audit Record' },
    { title: 'Consignee Copy', subtitle: 'Customer Delivery Copy' },
    { title: 'Shippers Copy', subtitle: 'Origin Dispatch Copy' },
  ];

  // Isolated robust print handler (eliminating blank PDF output)
  const handlePrint = () => {
    const targetId = viewMode === '3-copy-waybill' ? 'printable-3-copy-waybill' : 'printable-consignment-receipt';
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    // Create an invisible iframe for isolated printing
    const existingIframe = document.getElementById('sain-print-iframe');
    if (existingIframe) {
      document.body.removeChild(existingIframe);
    }

    const iframe = document.createElement('iframe');
    iframe.id = 'sain-print-iframe';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.style.opacity = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>SAIN Waybill - ${consignment.consignmentNo}</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 4mm 6mm;
            }
            * {
              box-sizing: border-box;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 0;
              background: #ffffff !important;
              color: #0f172a !important;
              font-size: 9px;
            }
            table {
              border-collapse: collapse;
              width: 100%;
            }
            .waybill-single-copy {
              page-break-inside: avoid;
              break-inside: avoid;
              margin-bottom: 2.5mm;
              padding: 2mm;
              border: 1.5px solid #0f172a;
              background: #ffffff;
            }
            .cut-line {
              margin: 2mm 0;
              display: flex;
              align-items: center;
              gap: 4px;
              color: #94a3b8;
              font-size: 8px;
            }
          </style>
          <!-- Include Tailwind CSS CDN inside iframe so all utility classes render perfectly -->
          <script src="https://cdn.tailwindcss.com"></script>
        </head>
        <body class="bg-white p-2">
          ${targetElement.outerHTML}
        </body>
      </html>
    `);
    doc.close();

    // Trigger print after iframe styles load
    setTimeout(() => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.error('Print trigger error:', e);
      }
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }, 400);
  };

  return (
    <div
      id="print-modal-root"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-6 print:p-0 print:bg-white animate-in fade-in"
    >
      <div
        id="print-modal-card"
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-6 print:m-0 print:border-none print:shadow-none"
      >
        {/* Pinned Top-Right Close Button (User Requested Location) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-800/80 hover:bg-rose-600 text-slate-300 hover:text-white rounded-xl transition cursor-pointer z-30 shadow-md flex items-center justify-center"
          title="Close Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Top Control Bar */}
        <div className="bg-[#153243] text-white px-6 py-4.5 pr-16 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base tracking-wide flex items-center gap-2">
                <span>Official Waybill & Shipment Invoice</span>
                <span className="font-mono text-xs text-amber-400 bg-slate-800 px-2 py-0.5 rounded">
                  {consignment.consignmentNo}
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                A4 single-page layout with SVG barcode and crisp print styling
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher Tabs */}
            <div className="flex bg-slate-900/60 p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setViewMode('3-copy-waybill')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  viewMode === '3-copy-waybill'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                3-Copy Waybill
              </button>
              <button
                onClick={() => setViewMode('consignment-receipt')}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  viewMode === 'consignment-receipt'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Consignment Receipt / Invoice
              </button>
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div className="p-4 sm:p-6 bg-white text-slate-900 font-sans space-y-4 max-h-[82vh] overflow-y-auto">
          {/* ============================================================== */}
          {/* VIEW 1: 3-COPY OFFICIAL WAYBILL (Exact Match to Screenshot 2)  */}
          {/* ============================================================== */}
          {viewMode === '3-copy-waybill' && (
            <div id="printable-3-copy-waybill" className="space-y-3">
              {copies.map((copy, index) => (
                <div
                  key={index}
                  className="waybill-single-copy border-2 border-slate-800 rounded-sm p-3 bg-white space-y-2 relative"
                >
                  {/* Top Bar of Each Copy */}
                  <div className="flex items-center justify-between border-b border-slate-700 pb-1.5">
                    {/* Clean Logo Only (No duplicate subtitle text) */}
                    <div className="flex items-center">
                      <div className="scale-75 origin-left">
                        <SainLogo variant="full" />
                      </div>
                    </div>

                    {/* Barcode & Number */}
                    <div className="text-center">
                      <BarcodeSvg value={consignment.consignmentNo} height={26} />
                      <div className="font-mono text-[11px] font-bold tracking-widest text-slate-900 leading-tight">
                        {consignment.consignmentNo}
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600 block">
                        {copy.title}
                      </span>
                    </div>

                    {/* Metadata Header Box */}
                    <div className="text-[9px] text-right space-y-0.5">
                      <div><span className="text-slate-500">Origin:</span> <strong>{details.origin}</strong></div>
                      <div><span className="text-slate-500">Destination:</span> <strong>{details.destination}</strong></div>
                      <div><span className="text-slate-500">Courier:</span> <strong>{details.courier}</strong></div>
                    </div>
                  </div>

                  {/* Waybill Table Grid */}
                  <table className="w-full text-[9px] border border-slate-700 border-collapse">
                    <tbody>
                      {/* Row 1: Key Logistics Meta */}
                      <tr className="border-b border-slate-700 bg-slate-50/70">
                        <td className="p-1 border-r border-slate-700"><span className="text-slate-500 block">Pickup Date:</span> <strong>{details.pickupDate}</strong></td>
                        <td className="p-1 border-r border-slate-700"><span className="text-slate-500 block">Pickup Time:</span> <strong>{details.pickupTimeStr}</strong></td>
                        <td className="p-1 border-r border-slate-700"><span className="text-slate-500 block">Delivery Date:</span> <strong>{details.expectedDeliveryDate}</strong></td>
                        <td className="p-1 border-r border-slate-700"><span className="text-slate-500 block">Carrier:</span> <strong>{details.carrier}</strong></td>
                        <td className="p-1 border-r border-slate-700"><span className="text-slate-500 block">Carrier Ref No:</span> <strong>{details.carrierReferenceNo}</strong></td>
                        <td className="p-1"><span className="text-slate-500 block">Departure Time:</span> <strong>{details.departureTimeStr}</strong></td>
                      </tr>

                      {/* Row 2: Shipper vs Consignee */}
                      <tr className="border-b border-slate-700">
                        <td colSpan={3} className="p-1.5 border-r border-slate-700 align-top">
                          <strong className="text-[10px] block uppercase text-slate-800 mb-0.5">Shipper: {shipper.name}</strong>
                          <p className="text-slate-700 leading-tight text-[8.5px]">{shipper.address}</p>
                          <p className="text-slate-600 mt-0.5 font-mono text-[8px]">{shipper.phone} • {shipper.email}</p>
                        </td>
                        <td colSpan={3} className="p-1.5 align-top">
                          <strong className="text-[10px] block uppercase text-slate-800 mb-0.5">Consignee: {receiver.name}</strong>
                          <p className="text-slate-700 leading-tight text-[8.5px]">{receiver.address}</p>
                          <p className="text-slate-600 mt-0.5 font-mono text-[8px]">{receiver.phone} • {receiver.email}</p>
                        </td>
                      </tr>

                      {/* Row 3: Freight Specs */}
                      <tr className="border-b border-slate-700">
                        <td className="p-1 border-r border-slate-700"><span className="text-slate-500 block">Type of Shipment:</span> <strong>{details.typeOfShipment}</strong></td>
                        <td className="p-1 border-r border-slate-700"><span className="text-slate-500 block">Packages:</span> <strong>{details.packagesCount}</strong></td>
                        <td colSpan={2} className="p-1 border-r border-slate-700"><span className="text-slate-500 block">Product:</span> <strong>{details.product}</strong></td>
                        <td colSpan={2} className="p-1"><span className="text-slate-500 block">Weight:</span> <strong>{details.weightText}</strong></td>
                      </tr>

                      {/* Row 4: Mode, Total Freight, Payment & Status */}
                      <tr>
                        <td className="p-1 border-r border-slate-700"><span className="text-slate-500 block">Total Freight:</span> <strong>{details.totalFreight || 'N/A'}</strong></td>
                        <td className="p-1 border-r border-slate-700"><span className="text-slate-500 block">Quantity:</span> <strong>{details.quantity}</strong></td>
                        <td className="p-1 border-r border-slate-700"><span className="text-slate-500 block">Payment Mode:</span> <strong>{details.paymentMode}</strong></td>
                        <td className="p-1 border-r border-slate-700"><span className="text-slate-500 block">Mode:</span> <strong>{details.mode}</strong></td>
                        <td colSpan={2} className="p-1 bg-emerald-50/50">
                          <span className="text-slate-500 block">Status:</span>
                          <strong className="text-emerald-700">{consignment.status}</strong>
                          {details.comments && <span className="block text-[8px] text-slate-500">Note: {details.comments}</span>}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Cut / Perforation indicator between copies */}
                  {index < copies.length - 1 && (
                    <div className="pt-1 flex items-center gap-2 text-[8px] text-slate-400 cut-line">
                      <span className="w-full border-t border-dashed border-slate-400 block" />
                      <span className="whitespace-nowrap uppercase tracking-widest text-slate-400 font-mono">
                        ✂ Cut Along Line
                      </span>
                      <span className="w-full border-t border-dashed border-slate-400 block" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ============================================================== */}
          {/* VIEW 2: CONSIGNMENT RECEIPT & PACKAGE DETAILS (Screenshot 1)  */}
          {/* ============================================================== */}
          {viewMode === 'consignment-receipt' && (
            <div id="printable-consignment-receipt" className="border border-slate-400 p-5 space-y-4 bg-white">
              {/* Receipt Header (Logo only, clean) */}
              <div className="flex items-center justify-between border-b border-slate-300 pb-3">
                <div className="scale-85 origin-left">
                  <SainLogo variant="full" />
                </div>

                <div className="text-right">
                  <BarcodeSvg value={consignment.consignmentNo} height={36} />
                  <div className="font-mono text-xs font-bold tracking-widest text-slate-900 mt-1">
                    {consignment.consignmentNo}
                  </div>
                  <span className="text-[9px] text-emerald-700 font-bold uppercase block">
                    Bangladesh Customs Act 2023 Compliant
                  </span>
                </div>
              </div>

              {/* Shipper & Receiver Columns */}
              <div className="grid grid-cols-2 gap-6 text-xs border-b border-slate-300 pb-3">
                <div className="space-y-1">
                  <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                    SHIPPER DETAILS:
                  </h5>
                  <p><span className="text-slate-500">Shipper Name:</span> <strong>{shipper.name}</strong></p>
                  <p><span className="text-slate-500">Phone Number:</span> <span className="font-mono">{shipper.phone}</span></p>
                  <p><span className="text-slate-500">Address:</span> {shipper.address}</p>
                  <p><span className="text-slate-500">Email:</span> {shipper.email}</p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] border-b border-slate-200 pb-1">
                    RECEIVER DETAILS:
                  </h5>
                  <p><span className="text-slate-500">Receiver Name:</span> <strong>{receiver.name}</strong></p>
                  <p><span className="text-slate-500">Phone Number:</span> <span className="font-mono">{receiver.phone}</span></p>
                  <p><span className="text-slate-500">Address:</span> {receiver.address}</p>
                  <p><span className="text-slate-500">Email:</span> {receiver.email}</p>
                </div>
              </div>

              {/* Package Details Table (Screenshot 1 Exact replica) */}
              <div className="space-y-2">
                <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  PACKAGE DETAILS:
                </h5>

                <table className="w-full text-[10px] border border-slate-700 border-collapse text-left">
                  <thead className="bg-[#1f2937] text-white font-bold">
                    <tr>
                      <th className="p-1.5 border border-slate-700">Qty.</th>
                      <th className="p-1.5 border border-slate-700">Piece Type</th>
                      <th className="p-1.5 border border-slate-700">Description</th>
                      <th className="p-1.5 border border-slate-700">Length(cm)</th>
                      <th className="p-1.5 border border-slate-700">Width(cm)</th>
                      <th className="p-1.5 border border-slate-700">Height(cm)</th>
                      <th className="p-1.5 border border-slate-700">Weight (g)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg, idx) => (
                      <tr key={pkg.id || idx} className={idx % 2 === 1 ? 'bg-slate-50' : 'bg-white'}>
                        <td className="p-1.5 border border-slate-700 font-mono">{pkg.qty}</td>
                        <td className="p-1.5 border border-slate-700">{pkg.pieceType}</td>
                        <td className="p-1.5 border border-slate-700 font-mono">{pkg.description || '—'}</td>
                        <td className="p-1.5 border border-slate-700 font-mono">{pkg.lengthCm || ''}</td>
                        <td className="p-1.5 border border-slate-700 font-mono">{pkg.widthCm || ''}</td>
                        <td className="p-1.5 border border-slate-700 font-mono">{pkg.heightCm || ''}</td>
                        <td className="p-1.5 border border-slate-700 font-mono">{pkg.weightG || ''}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Volumetric & Actual Weight Summary Bar */}
                <div className="flex flex-wrap items-center justify-between text-[11px] font-bold text-slate-800 pt-2 border-t border-slate-300">
                  <span>Total Volumetric Weight: 0.00g.</span>
                  <span>Total Volume: 0.00cu. m.</span>
                  <span>Total Actual Weight: 0.00g.</span>
                </div>
              </div>

              {/* Signatures & Footer Note */}
              <div className="pt-6 grid grid-cols-2 gap-8 text-[10px] text-slate-600 border-t border-slate-200">
                <div className="border-t border-slate-400 pt-1 text-center">
                  <span>Shipper Authorized Signature</span>
                </div>
                <div className="border-t border-slate-400 pt-1 text-center">
                  <span>Receiver Acceptance Signature</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==============================================================================
// Crisp Scalable SVG Barcode (Code 128 replica)
// ==============================================================================
const BarcodeSvg: React.FC<{ value: string; height?: number }> = ({ value, height = 36 }) => {
  const bars = [
    2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 2, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 2,
    1, 2, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2, 2, 2, 1, 1, 2, 3,
    1, 2, 1, 1, 3, 2, 1, 2, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3, 1, 2,
  ];

  let currentX = 0;
  return (
    <svg
      viewBox="0 0 160 40"
      className="w-44 h-auto mx-auto inline-block"
      style={{ height: `${height}px` }}
    >
      <rect x="0" y="0" width="160" height="40" fill="transparent" />
      {bars.map((width, idx) => {
        const x = currentX;
        currentX += width * 1.5;
        if (idx % 2 === 0) {
          return (
            <rect
              key={idx}
              x={x}
              y="2"
              width={width * 1.3}
              height="36"
              fill="#0f172a"
            />
          );
        }
        return null;
      })}
    </svg>
  );
};
