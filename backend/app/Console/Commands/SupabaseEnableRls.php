<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class SupabaseEnableRls extends Command
{
    protected $signature = 'supabase:enable-rls
        {--pretend : Show SQL without executing}
        {--file : Path to custom SQL file}';

    protected $description = 'Enable Row Level Security on all Supabase tables and create policies';

    public function handle(): int
    {
        $sqlPath = $this->option('file') ?: database_path('supabase/rls.sql');

        if (!File::exists($sqlPath)) {
            $this->error("SQL file not found: {$sqlPath}");
            $this->warn('Run this in Supabase SQL Editor until the DB connection is live.');
            return Command::FAILURE;
        }

        $sql = File::get($sqlPath);

        // Remove verification queries at the bottom (they are for manual reference)
        $sections = explode('-- =============================================================================' . PHP_EOL . '-- 6. VERIFICATION', $sql);
        $sql = trim($sections[0]);

        if ($this->option('pretend')) {
            $this->info('=== PRETEND MODE — SQL that would be executed ===');
            $this->line($sql);
            return Command::SUCCESS;
        }

        // Split by semicolons and execute each statement
        $statements = array_filter(
            array_map('trim', explode(';', $sql)),
            fn($s) => !empty($s) && !str_starts_with($s, '--')
        );

        $total = count($statements);
        $success = 0;
        $errors = [];

        $this->output->progressStart($total);

        foreach ($statements as $stmt) {
            try {
                DB::statement($stmt);
                $success++;
            } catch (\Exception $e) {
                $errors[] = $e->getMessage();
            }
            $this->output->progressAdvance();
        }

        $this->output->progressFinish();

        $this->newLine();
        $this->info("RLS setup complete: {$success}/{$total} statements executed successfully.");

        if (!empty($errors)) {
            $this->warn('Errors encountered (' . count($errors) . '):');
            foreach (array_slice($errors, 0, 10) as $error) {
                $this->error("  • {$error}");
            }
            if (count($errors) > 10) {
                $this->warn('  ... and ' . (count($errors) - 10) . ' more errors.');
            }
            return Command::FAILURE;
        }

        $this->info('All RLS policies applied. Laravel integration is unaffected.');
        $this->warn('Run verification queries in Supabase SQL Editor to confirm.');
        $this->warn('  SELECT tablename, policyname FROM pg_policies WHERE schemaname = \'public\' ORDER BY tablename;');

        return Command::SUCCESS;
    }
}
