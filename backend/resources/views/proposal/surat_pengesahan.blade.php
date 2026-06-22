<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Surat Pengesahan Proposal</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            margin: 60px;
            color: #1a1a1a;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #1a1a1a;
            padding-bottom: 15px;
            margin-bottom: 25px;
        }
        .header h1 {
            font-size: 16pt;
            font-weight: bold;
            margin: 5px 0;
            text-transform: uppercase;
        }
        .header h2 {
            font-size: 14pt;
            font-weight: bold;
            margin: 5px 0;
            text-decoration: underline;
        }
        .header p {
            font-size: 11pt;
            margin: 2px 0;
        }
        .content {
            margin: 20px 0;
        }
        .content p {
            text-align: justify;
            margin: 8px 0;
        }
        .info-table {
            width: 100%;
            margin: 15px 0;
        }
        .info-table td {
            padding: 4px 8px;
            vertical-align: top;
        }
        .info-table td:first-child {
            width: 140px;
        }
        .status-verified {
            color: #059669;
            font-weight: bold;
        }
        .signature-section {
            margin-top: 50px;
            text-align: right;
        }
        .signature-section .signature-img {
            width: 150px;
            height: auto;
            margin: 10px 0;
        }
        .signature-section .signature-placeholder {
            width: 150px;
            height: 70px;
            border-bottom: 1px solid #1a1a1a;
            margin: 10px auto;
        }
        .footer {
            margin-top: 30px;
            font-size: 10pt;
            text-align: center;
            border-top: 1px solid #ccc;
            padding-top: 10px;
        }
        .qr-section {
            text-align: center;
            margin: 20px 0;
        }
        .qr-section img {
            width: 80px;
            height: 80px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>BADAN EKSEKUTIF MAHASISWA</h1>
        <h2>UNIVERSITAS NUSA PUTRA</h2>
        <p>Sekretariat: Kampus Universitas Nusa Putra</p>
        <hr style="border: 1px solid #1a1a1a;">
        <h2>SURAT PENGESAHAN PROPOSAL</h2>
        <p>Nomor: {{ $check->id }}/BEM-NP/SP/{{ date('Y') }}</p>
    </div>

    <div class="content">
        <p>Yang bertanda tangan di bawah ini, Presiden Mahasiswa BEM Universitas Nusa Putra, dengan ini menyatakan bahwa proposal berikut telah diperiksa dan dinyatakan <span class="status-verified">SESUAI</span> dengan panduan yang berlaku.</p>

        <table class="info-table">
            <tr>
                <td>Nama File</td>
                <td>: {{ $check->nama_file }}</td>
            </tr>
            <tr>
                <td>Tanggal Pengesahan</td>
                <td>: {{ $check->signed_at ? $check->signed_at->format('d F Y') : date('d F Y') }}</td>
            </tr>
            <tr>
                <td>Panduan Acuan</td>
                <td>: {{ $guideline->judul ?? '-' }}</td>
            </tr>
            <tr>
                <td>Jumlah Issue</td>
                <td>: {{ $check->jumlah_issues }} (Tidak ada ketidaksesuaian)</td>
            </tr>
            <tr>
                <td>Status</td>
                <td>: <span class="status-verified">DISETUJUI</span></td>
            </tr>
        </table>

        <p>Proposal ini telah melalui proses pengecekan compliance berbasis AI dan telah direview oleh admin. Dengan dikeluarkannya surat pengesahan ini, proposal dinyatakan sah dan dapat ditindaklanjuti.</p>
    </div>

    <div class="signature-section">
        <p style="margin-bottom: 5px;">Sukabumi, {{ $check->signed_at ? $check->signed_at->format('d F Y') : date('d F Y') }}</p>
        <p style="margin-bottom: 40px;">Presiden Mahasiswa,</p>

        @if($signaturePath && file_exists($signaturePath))
            <img src="{{ $signaturePath }}" alt="Tanda Tangan" class="signature-img">
        @else
            <div class="signature-placeholder"></div>
        @endif

        <p style="font-weight: bold; margin-top: 5px;">{{ $signer->name ?? 'Presiden Mahasiswa' }}</p>
        <p>NIM. {{ $signer->nim ?? '-' }}</p>
    </div>

    <div class="qr-section">
        <p style="font-size: 10pt;">Verifikasi dokumen: {{ url('/verify/' . $check->id) }}</p>
    </div>

    <div class="footer">
        <p>Dokumen ini diterbitkan secara elektronik dan sah tanpa tanda tangan basah.</p>
        <p>Sistem Informasi BEM - Universitas Nusa Putra</p>
    </div>
</body>
</html>
