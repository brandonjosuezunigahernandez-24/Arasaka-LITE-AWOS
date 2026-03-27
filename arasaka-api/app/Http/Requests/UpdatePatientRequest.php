<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePatientRequest extends FormRequest
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
            'curp'       => ['nullable', 'string', 'size:18', 'regex:/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/'],
            'blood_type' => 'nullable|in:A+,A-,B+,B-,AB+,AB-,O+,O-',
            'weight_kg'  => 'nullable|numeric|min:10|max:300',
            'height_cm'  => 'nullable|integer|min:50|max:250',
            'phone'      => 'nullable|string|max:20',
        ];
    }

    public function messages(): array
    {
        return [
            'blood_type.in'  => 'El tipo de sangre no es válido.',
            'weight_kg.min'  => 'El peso debe estar entre 10 y 300 kg.',
            'weight_kg.max'  => 'El peso debe estar entre 10 y 300 kg.',
            'height_cm.min'  => 'La estatura debe estar entre 50 y 250 cm.',
            'height_cm.max'  => 'La estatura debe estar entre 50 y 250 cm.',
        ];
    }
}
