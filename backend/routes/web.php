<?php

use App\Http\Controllers\Admin\ImportController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('admin')->group(function () {
    Route::get('/import', [ImportController::class, 'index']);
    Route::post('/import', [ImportController::class, 'store']);
});
