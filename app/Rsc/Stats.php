<?php

namespace App\Rsc;

class Stats
{
    public function fetch(): array
    {
        usleep(2_500_000); // 2.5s simulated latency

        return [
            ['label' => 'Active Users', 'value' => rand(1200, 1800)],
            ['label' => 'Requests / min', 'value' => rand(8000, 12000)],
            ['label' => 'Avg Response', 'value' => rand(12, 45) . 'ms'],
            ['label' => 'Cache Hit Rate', 'value' => rand(94, 99) . '%'],
        ];
    }
}
