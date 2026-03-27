<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PatientProfile extends Model
{
    protected $fillable = [
        'user_id',
        'curp',
        'blood_type',
        'weight_kg',
        'height_cm',
        'phone',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
