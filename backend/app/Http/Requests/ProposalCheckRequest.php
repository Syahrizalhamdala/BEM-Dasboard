<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProposalCheckRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'file' => 'required|file|mimes:pdf,doc,docx|max:20480',
        ];
    }

    public function messages(): array
    {
        return [
            'file.required' => 'Pilih file proposal terlebih dahulu.',
            'file.mimes' => 'File harus berupa PDF atau Word (doc/docx).',
            'file.max' => 'Ukuran file maksimal 20MB.',
        ];
    }
}
