<?php

use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PatientController;
use Illuminate\Support\Facades\Route;

// ── Autenticación (pública) ───────────────────────────────────────────────────
Route::prefix('v1/auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// ── Rutas protegidas con Sanctum ─────────────────────────────────────────────
Route::prefix('v1')->middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Pacientes
    Route::get('/patients',       [PatientController::class, 'index']);
    Route::get('/patients/{id}',  [PatientController::class, 'show']);
    Route::put('/patients/{id}',  [PatientController::class, 'update']);
    Route::delete('/patients/{id}', [PatientController::class, 'destroy']);

    // Citas
    Route::get('/appointments',        [AppointmentController::class, 'index']);
    Route::post('/appointments',       [AppointmentController::class, 'store']);
    Route::patch('/appointments/{id}', [AppointmentController::class, 'update']);
    Route::delete('/appointments/{id}', [AppointmentController::class, 'destroy']);
});
