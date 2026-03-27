<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAppointmentRequest extends FormRequest
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
            'status' => 'required|in:confirmed,cancelled',
        ];
    }

    public function messages(): array
    {
        return [
            'status.in' => 'El estado debe ser confirmed o cancelled.',
        ];
    }
}
