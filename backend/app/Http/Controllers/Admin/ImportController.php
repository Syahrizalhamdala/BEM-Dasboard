<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Chatbot\ExcelImportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ImportController extends Controller
{
    protected ExcelImportService $excelImportService;

    public function __construct(ExcelImportService $excelImportService)
    {
        $this->excelImportService = $excelImportService;
    }

    public function index()
    {
        return view('admin.import');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:xlsx,xls|max:5120',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput();
        }

        try {
            $file = $request->file('file');
            $filename = uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(storage_path('app/temp'), $filename);
            $fullPath = storage_path('app/temp/' . $filename);

            $result = $this->excelImportService->import($fullPath);

            if ($result['success']) {
                return redirect()->back()
                    ->with('success', $result['message'])
                    ->with('results', $result['results']);
            }

            return redirect()->back()
                ->with('error', $result['message'])
                ->with('results', $result['results']);
        } catch (\Exception $e) {
            return redirect()->back()
                ->with('error', 'Gagal mengimpor file: ' . $e->getMessage());
        }
    }
}
