<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePatientRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;

class PatientController extends Controller
{
    public function index(): JsonResponse
    {
        if (!auth()->user()->isDoctor()) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para realizar esta acción.',
                'errors'  => [],
            ], 403);
        }

        $patients = User::where('role', 'patient')->with('profile')->get()
            ->map(fn($u) => $this->formatPatient($u));

        return response()->json([
            'success' => true,
            'message' => 'Pacientes obtenidos correctamente.',
            'data'    => $patients,
        ], 200);
    }

    public function show(int $id): JsonResponse
    {
        $patient = User::where('id', $id)->where('role', 'patient')->with('profile')->first();

        if (!$patient) {
            return response()->json(['success' => false, 'message' => 'Paciente no encontrado.', 'errors' => []], 404);
        }

        $authUser = auth()->user();
        if ($authUser->isPatient() && $authUser->id !== $patient->id) {
            return response()->json(['success' => false, 'message' => 'No tienes permiso para realizar esta acción.', 'errors' => []], 403);
        }

        $data = $this->formatPatient($patient);
        $data['appointments_count'] = $patient->appointmentsAsPatient()->count();

        return response()->json(['success' => true, 'message' => 'Paciente obtenido correctamente.', 'data' => $data], 200);
    }

    public function update(UpdatePatientRequest $request, int $id): JsonResponse
    {
        $patient = User::where('id', $id)->where('role', 'patient')->with('profile')->first();

        if (!$patient) {
            return response()->json(['success' => false, 'message' => 'Paciente no encontrado.', 'errors' => []], 404);
        }

        if (auth()->id() !== $patient->id) {
            return response()->json(['success' => false, 'message' => 'Solo puedes editar tu propio perfil.', 'errors' => []], 403);
        }

        $patient->profile->update($request->only('curp', 'blood_type', 'weight_kg', 'height_cm', 'phone'));

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado correctamente.',
            'data'    => $this->formatPatient($patient->fresh('profile')),
        ], 200);
    }

    public function destroy(int $id): JsonResponse
    {
        if (!auth()->user()->isDoctor()) {
            return response()->json(['success' => false, 'message' => 'No tienes permiso para realizar esta acción.', 'errors' => []], 403);
        }

        $patient = User::where('id', $id)->where('role', 'patient')->first();

        if (!$patient) {
            return response()->json(['success' => false, 'message' => 'Paciente no encontrado.', 'errors' => []], 404);
        }

        $patient->delete();

        return response()->noContent();
    }

    private function formatPatient(User $user): array
    {
        return [
            'id'      => $user->id,
            'name'    => $user->name,
            'email'   => $user->email,
            'role'    => $user->role,
            'profile' => $user->profile ? [
                'curp'       => $user->profile->curp,
                'blood_type' => $user->profile->blood_type,
                'weight_kg'  => $user->profile->weight_kg,
                'height_cm'  => $user->profile->height_cm,
                'phone'      => $user->profile->phone,
            ] : null,
        ];
    }
}
