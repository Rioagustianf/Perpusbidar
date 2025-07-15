<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthenticatedMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!Auth::check()) {
            // Jika request adalah AJAX/Inertia, redirect dengan session flash
            if ($request->expectsJson() || $request->header('X-Inertia')) {
                return redirect()->route('login')->with('message', 'Silakan login terlebih dahulu untuk mengakses halaman ini.');
            }
            
            // Untuk request biasa
            return redirect()->route('login')->with('message', 'Silakan login terlebih dahulu untuk mengakses halaman ini.');
        }

        return $next($request);
    }
}
