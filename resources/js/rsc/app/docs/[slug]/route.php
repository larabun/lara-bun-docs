<?php

use LaraBun\Rsc\PageRoute;

return PageRoute::make()
    ->staticPaths([
        'installation',
        'configuration',
        'how-it-works',
        'inertia-ssr',
        'rsc',
        'php-callables',
        'server-actions',
        'authorization',
        'validation',
        'static-generation',
        'deployment',
    ])
    ->viewData(fn (string $slug) => [
        'title' => match ($slug) {
            'installation' => 'Installation — LaraBun Docs',
            'configuration' => 'Configuration — LaraBun Docs',
            'how-it-works' => 'How It Works — LaraBun Docs',
            'inertia-ssr' => 'Inertia SSR — LaraBun Docs',
            'rsc' => 'React Server Components — LaraBun Docs',
            'php-callables' => 'PHP Callables — LaraBun Docs',
            'server-actions' => 'Server Actions — LaraBun Docs',
            'authorization' => 'Authorization — LaraBun Docs',
            'validation' => 'Validation — LaraBun Docs',
            'static-generation' => 'Static Generation — LaraBun Docs',
            'deployment' => 'Deployment — LaraBun Docs',
            default => 'LaraBun Docs',
        },
    ]);
