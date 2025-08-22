<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class WablasClient
{
    private string $baseUrl;
    private string $token;
    private string $secret;

    public function __construct()
    {
        $this->baseUrl = rtrim(env('WABLAS_BASE_URL', 'https://bdg.wablas.com'), '/');
        $this->token = (string) env('WABLAS_TOKEN', '');
        $this->secret = (string) env('WABLAS_SECRET', '');
    }

    public function isConfigured(): bool
    {
        return $this->token !== '' && $this->secret !== '';
    }

    /**
     * Send a plain text WhatsApp message via Wablas
     */
    public function sendMessage(string $e164PhoneNumber, string $message): array
    {
        return $this->sendMessages([
            [
                'phone' => ltrim($e164PhoneNumber, '+'),
                'message' => $message,
                'isGroup' => 'false',
            ],
        ]);
    }

    /**
     * Send bulk messages using Wablas v2 API format
     * Each item: ['phone' => '62812...', 'message' => 'text', 'isGroup' => 'false']
     */
    public function sendMessages(array $messages): array
    {
        $endpoint = $this->baseUrl . '/api/v2/send-message';

        $authHeader = $this->token . '.' . $this->secret;

        $response = Http::asJson()
            ->withHeaders([
                'Authorization' => $authHeader,
            ])
            ->post($endpoint, [
                'data' => $messages,
            ]);

        return [
            'ok' => $response->successful() && (bool) data_get($response->json(), 'status', false),
            'status' => $response->status(),
            'body' => $response->json(),
        ];
    }
}


