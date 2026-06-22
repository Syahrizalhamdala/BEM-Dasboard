<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Import Data BEM</title>
    <style>
        body { font-family: system-ui, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; }
        h1 { margin-bottom: 24px; }
        .alert { padding: 12px 16px; border-radius: 6px; margin-bottom: 16px; }
        .alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .alert-error { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        form { margin-bottom: 32px; }
        input[type="file"] { display: block; margin-bottom: 12px; }
        button { padding: 8px 20px; background: #0d6efd; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0b5ed7; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border: 1px solid #dee2e6; padding: 8px 12px; text-align: left; }
        th { background: #f8f9fa; }
        .text-success { color: #155724; }
        .text-danger { color: #721c24; }
        .text-muted { color: #6c757d; }
    </style>
</head>
<body>
    <h1>Import Data Excel BEM</h1>

    @if (session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if (session('error'))
        <div class="alert alert-error">{{ session('error') }}</div>
    @endif

    @if ($errors->any())
        <div class="alert alert-error">
            <ul style="margin: 0; padding-left: 20px;">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ url('/admin/import') }}" method="POST" enctype="multipart/form-data">
        @csrf
        <input type="file" name="file" accept=".xlsx,.xls" required>
        <button type="submit">Upload & Import</button>
    </form>

    @if (session('results'))
        <h2>Hasil Import</h2>
        <table>
            <thead>
                <tr>
                    <th>Sheet</th>
                    <th>Sukses</th>
                    <th>Gagal</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Kabinet</td>
                    <td class="text-success">{{ session('results')['kabinet']['success'] }}</td>
                    <td class="text-danger">{{ session('results')['kabinet']['failed'] }}</td>
                </tr>
                <tr>
                    <td>Program Kerja</td>
                    <td class="text-success">{{ session('results')['program_kerja']['success'] }}</td>
                    <td class="text-danger">{{ session('results')['program_kerja']['failed'] }}</td>
                </tr>
                <tr>
                    <td>Jadwal Rapat</td>
                    <td class="text-success">{{ session('results')['jadwal_rapat']['success'] }}</td>
                    <td class="text-danger">{{ session('results')['jadwal_rapat']['failed'] }}</td>
                </tr>
            </tbody>
        </table>
    @endif
</body>
</html>
