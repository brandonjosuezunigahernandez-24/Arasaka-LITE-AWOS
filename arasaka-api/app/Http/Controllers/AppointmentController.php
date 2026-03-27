<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAppointmentRequest;
use App\Http\Requests\UpdateAppointmentRequest;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class AppointmentController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();

        if ($user->isDoctor()) {
            $appointments = Appointment::where('doctor_id', $user->id)
                ->with(['patient', 'doctor'])
                ->orderBy('scheduled_at')
                ->get();
        } else {
            $appointments = Appointment::where('patient_id', $user->id)
                ->with(['patient', 'doctor'])
                ->orderBy('scheduled_at')
                ->get();
        }

        return response()->json([
            'success' => true,
            'message' => 'Citas obtenidas correctamente.',
            'data'    => $appointments->map(fn($a) => $this->formatAppointment($a)),
        ], 200);
    }

    public function store(StoreAppointmentRequest $request): JsonResponse
    {
        if (!auth()->user()->isPatient()) {
            return response()->json(['success' => false, 'message' => 'Solo los pacientes pueden agendar citas.', 'errors' => []], 403);
        }

        $doctor = User::find($request->doctor_id);
        if (!$doctor || !$doctor->isDoctor()) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación.',
                'errors'  => ['doctor_id' => ['El médico seleccionado no existe.']],
            ], 422);
        }

        $conflict = Appointment::where('doctor_id', $request->doctor_id)
            ->where('patient_id', auth()->id())
            ->where('scheduled_at', $request->scheduled_at)
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($conflict) {
            return response()->json(['success' => false, 'message' => 'Ya tienes una cita con este médico en ese horario.', 'errors' => []], 409);
        }

        $appointment = Appointment::create([
            'patient_id'   => auth()->id(),
            'doctor_id'    => $request->doctor_id,
            'scheduled_at' => $request->scheduled_at,
            'notes'        => $request->notes,
            'status'       => 'pending',
        ]);

        $appointment->load(['patient', 'doctor']);

        return response()->json([
            'success' => true,
            'message' => 'Cita agendada correctamente.',
            'data'    => $this->formatAppointment($appointment),
        ], 201);
    }

    public function update(UpdateAppointmentRequest $request, int $id): JsonResponse
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json(['success' => false, 'message' => 'Cita no encontrada.', 'errors' => []], 404);
        }

        $user   = auth()->user();
        $status = $request->status;

        if ($status === 'confirmed' && !$user->isDoctor()) {
            return response()->json(['success' => false, 'message' => 'No puedes confirmar una cita que no te pertenece.', 'errors' => []], 403);
        }

        if ($status === 'confirmed' && $appointment->doctor_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'No puedes confirmar una cita que no te pertenece.', 'errors' => []], 403);
        }

        if ($status === 'cancelled' && $user->isPatient() && $appointment->patient_id !== $user->id) {
            return response()->json(['success' => false, 'message' => 'No puedes cancelar una cita que no te pertenece.', 'errors' => []], 403);
        }

        $appointment->update(['status' => $status]);
        $appointment->load(['patient', 'doctor']);

        return response()->json([
            'success' => true,
            'message' => 'Cita actualizada correctamente.',
            'data'    => $this->formatAppointment($appointment),
        ], 200);
    }

    public function destroy(int $id): JsonResponse|\Illuminate\Http\Response
    {
        $appointment = Appointment::find($id);

        if (!$appointment) {
            return response()->json(['success' => false, 'message' => 'Cita no encontrada.', 'errors' => []], 404);
        }

        $user = auth()->user();

        if ($user->isPatient()) {
            if ($appointment->patient_id !== $user->id) {
                return response()->json(['success' => false, 'message' => 'No puedes eliminar una cita que no te pertenece.', 'errors' => []], 403);
            }
            if ($appointment->status === 'confirmed') {
                return response()->json(['success' => false, 'message' => 'No puedes eliminar una cita que ya fue confirmada.', 'errors' => []], 403);
            }
        }

        $appointment->delete();

        return response()->noContent();
    }

    private function formatAppointment(Appointment $a): array
    {
        return [
            'id'           => $a->id,
            'scheduled_at' => $a->scheduled_at->toIso8601String(),
            'status'       => $a->status,
            'notes'        => $a->notes,
            'patient'      => ['id' => $a->patient->id, 'name' => $a->patient->name],
            'doctor'       => ['id' => $a->doctor->id, 'name' => $a->doctor->name],
        ];
    }
}
