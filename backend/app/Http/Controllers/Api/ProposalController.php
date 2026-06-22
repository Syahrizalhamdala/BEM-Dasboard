<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProposalCheckRequest;
use App\Models\ProposalCheck;
use App\Models\ProposalGuideline;
use App\Services\ProposalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProposalController extends Controller
{
    public function __construct(
        private ProposalService $proposalService,
    ) {}

    public function guidelines()
    {
        $guidelines = ProposalGuideline::orderBy('created_at', 'desc')->limit(100)->get();

        return response()->json([
            'success' => true,
            'data' => $guidelines,
        ]);
    }

    public function guidelineAktif()
    {
        $guideline = ProposalGuideline::where('aktif', true)->latest()->first();

        return response()->json([
            'success' => true,
            'data' => $guideline,
        ]);
    }

    public function uploadGuideline(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'file' => 'required|file|mimes:pdf,doc,docx|max:20480',
            'judul' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Data tidak valid.',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            ProposalGuideline::where('aktif', true)->update(['aktif' => false]);

            $guideline = $this->proposalService->uploadGuideline(
                $request->file('file'),
                $request->judul
            );

            return response()->json([
                'success' => true,
                'message' => 'Panduan berhasil diupload.',
                'data' => $guideline,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupload panduan: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function check(ProposalCheckRequest $request)
    {
        $guideline = ProposalGuideline::where('aktif', true)->latest()->first();

        if (!$guideline) {
            return response()->json([
                'success' => false,
                'message' => 'Belum ada panduan aktif. Admin harus upload panduan terlebih dahulu.',
            ], 400);
        }

        try {
            $file = $request->file('file');
            $kontenProposal = $this->proposalService->parseFile($file);

            $issues = $this->proposalService->checkWithAi($guideline, $kontenProposal);

            $jumlahIssues = count($issues);
            $status = $jumlahIssues === 0 ? 'lulus_ai' : 'fail';

            $check = ProposalCheck::create([
                'guideline_id' => $guideline->id,
                'nama_file' => $file->getClientOriginalName(),
                'konten_proposal' => $kontenProposal,
                'hasil_check' => $issues,
                'jumlah_issues' => $jumlahIssues,
                'status' => $status,
            ]);

            return response()->json([
                'success' => true,
                'message' => $status === 'lulus_ai'
                    ? 'Proposal sesuai panduan. Menunggu review admin.'
                    : 'Ditemukan ' . $jumlahIssues . ' ketidaksesuaian.',
                'data' => $check->load('guideline'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memproses proposal: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function checks()
    {
        $checks = ProposalCheck::with(['guideline', 'reviewer', 'signer'])
            ->orderBy('created_at', 'desc')
            ->limit(500)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $checks,
        ]);
    }

    public function checkDetail($id)
    {
        $check = ProposalCheck::with(['guideline', 'reviewer', 'signer'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $check,
        ]);
    }

    public function reviewQueue()
    {
        $checks = ProposalCheck::with(['guideline'])
            ->where('status', 'lulus_ai')
            ->orderBy('created_at', 'asc')
            ->limit(500)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $checks,
        ]);
    }

    public function review(Request $request, $id)
    {
        $check = ProposalCheck::findOrFail($id);

        if (!$check->canReview()) {
            return response()->json([
                'success' => false,
                'message' => 'Proposal tidak dalam status menunggu review.',
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'action' => 'required|in:approve,tolak',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $check->update([
            'status' => $request->action === 'approve' ? 'approved' : 'fail',
            'admin_notes' => $request->notes,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
        ]);

        $message = $request->action === 'approve'
            ? 'Proposal disetujui. Menunggu tanda tangan Presiden.'
            : 'Proposal ditolak.';

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $check->fresh()->load(['guideline', 'reviewer']),
        ]);
    }

    public function sign(Request $request, $id)
    {
        $check = ProposalCheck::findOrFail($id);

        if (!$check->canSign()) {
            return response()->json([
                'success' => false,
                'message' => 'Proposal belum bisa ditandatangani. Status harus approved.',
            ], 400);
        }

        $validator = Validator::make($request->all(), [
            'signature' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $signatureData = base64_decode($request->signature);
            $signatureFilename = 'signatures/' . $check->id . '_' . time() . '.png';
            Storage::disk('local')->put($signatureFilename, $signatureData);

            $check->update([
                'status' => 'signed',
                'signed_by' => $request->user()->id,
                'signed_at' => now(),
                'signature_path' => $signatureFilename,
            ]);

            $pdfPath = $this->proposalService->generateSuratPengesahan($check->fresh());

            return response()->json([
                'success' => true,
                'message' => 'Proposal berhasil ditandatangani.',
                'data' => [
                    'check' => $check->fresh()->load(['guideline', 'reviewer', 'signer']),
                    'pdf_url' => url('/api/proposal/' . $check->id . '/download'),
                    'pdf_path' => $pdfPath,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menandatangani: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function download($id)
    {
        $check = ProposalCheck::findOrFail($id);

        if ($check->status !== 'signed') {
            return response()->json([
                'success' => false,
                'message' => 'Proposal belum ditandatangani.',
            ], 400);
        }

        $pdfPath = 'proposals/surat_pengesahan_' . $check->id . '_' . $check->signed_at->timestamp . '.pdf';

        if (!Storage::disk('local')->exists($pdfPath)) {
            $pdfPath = $this->proposalService->generateSuratPengesahan($check);
        }

        return Storage::disk('local')->download($pdfPath, 'surat_pengesahan_' . $check->id . '.pdf');
    }

    public function pendingSignatures()
    {
        $checks = ProposalCheck::with(['guideline'])
            ->where('status', 'approved')
            ->orderBy('reviewed_at', 'asc')
            ->limit(500)
            ->get();

        return response()->json([
            'success' => true,
            'data' => $checks,
        ]);
    }
}
