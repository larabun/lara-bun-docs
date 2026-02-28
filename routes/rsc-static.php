<?php

use App\Http\Controllers\DocsController;
use Illuminate\Support\Facades\Route;

Route::get('/', [DocsController::class, 'landing'])->name('home');

Route::get('/docs/{slug}', [DocsController::class, 'show'])
    ->name('docs.show')
    ->staticPaths([
        'installation',
        'configuration',
        'how-it-works',
        'inertia-ssr',
        'rsc',
        'php-callables',
        'server-actions',
        'validation',
        'static-generation',
        'deployment',
    ]);
