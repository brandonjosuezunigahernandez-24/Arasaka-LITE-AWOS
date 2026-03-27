<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
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
            'name'                  => 'required|string|max:255',
            'email'                 => 'required|email|unique:users,email',
            'password'              => 'required|string|min:8|confirmed',
            'role'                  => 'required|in:doctor,patient',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required'                 => 'El nombre es obligatorio.',
            'email.required'                => 'El email es obligatorio.',
            'email.email'                   => 'El email no tiene un formato válido.',
            'email.unique'                  => 'El email ya está en uso.',
            'password.required'             => 'La contraseña es obligatoria.',
            'password.min'                  => 'La contraseña debe tener al menos 8 caracteres.',
            'password.confirmed'            => 'La confirmación de contraseña no coincide.',
            'role.required'                 => 'El rol es obligatorio.',
            'role.in'                       => 'El rol debe ser doctor o patient.',
        ];
    }
}
