<?php

namespace App\Http\Controllers;

use RamonMalcolm\LaraBun\Rsc\RscResponse;

class DocsController extends Controller
{
    /** @var array<string, string> */
    private const TITLES = [
        'installation' => 'Installation',
        'configuration' => 'Configuration',
        'how-it-works' => 'How It Works',
        'inertia-ssr' => 'Inertia SSR',
        'rsc' => 'React Server Components',
        'php-callables' => 'PHP Callables',
        'server-actions' => 'Server Actions',
        'validation' => 'Validation',
        'static-generation' => 'Static Generation',
        'deployment' => 'Deployment',
        'suspense-demo' => 'Suspense Demo',
    ];

    public function landing(): RscResponse
    {
        return rsc('LandingPage')
            ->layout('MarketingLayout')
            ->withViewData('title', 'LaraBun — Laravel + React Server Components');
    }

    public function show(string $slug): RscResponse
    {
        abort_unless(array_key_exists($slug, self::TITLES), 404);

        $component = 'Docs'.str($slug)->studly()->toString();
        $title = self::TITLES[$slug].' — LaraBun Docs';

        return rsc($component)
            ->layout('DocsLayout')
            ->withViewData('title', $title);
    }
}
