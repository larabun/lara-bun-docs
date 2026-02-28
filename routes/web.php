<?php

use App\Http\Controllers\DocsController;
use Illuminate\Support\Facades\Route;

Route::get('/docs/suspense-demo', [DocsController::class, 'show'])->name('docs.suspense');
