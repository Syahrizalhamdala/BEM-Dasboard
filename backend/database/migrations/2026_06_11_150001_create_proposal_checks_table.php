<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proposal_checks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guideline_id')->constrained('proposal_guidelines');
            $table->string('nama_file');
            $table->longText('konten_proposal');
            $table->json('hasil_check');
            $table->integer('jumlah_issues')->default(0);
            $table->string('status')->default('fail');
            $table->text('admin_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users');
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('signed_at')->nullable();
            $table->foreignId('signed_by')->nullable()->constrained('users');
            $table->string('signature_path')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proposal_checks');
    }
};
