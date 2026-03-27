<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreAppointmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'doctor_id'    => 'required|exists:users,id',
            'scheduled_at' => 'required|date|after:now',
            'notes'        => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'doctor_id.exists'      => 'El médico seleccionado no existe.',
            'scheduled_at.after'    => 'La fecha debe ser posterior a la fecha actual.',
        ];
    }
}
