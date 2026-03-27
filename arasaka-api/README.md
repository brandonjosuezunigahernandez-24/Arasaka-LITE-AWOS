# ArasakaHealth API

API REST para gestión clínica de pacientes diabéticos.  
**Universidad Tecnológica de Querétaro · Aplicaciones Web Orientadas a Servicios · LITIID003**

**Equipo:** Brandon J. Zuñiga H. · Joshua A. Centeno G. · Miguel A. Durán M.

---

## Framework y tecnologías

| Elemento | Versión |
|---|---|
| Framework | Laravel 11 |
| Lenguaje | PHP 8.3+ |
| Autenticación | Laravel Sanctum 4.x |
| Base de datos | MySQL 8.x (XAMPP local) |
| ORM | Eloquent (incluido en Laravel) |

---

## Requisitos para ejecutar

- PHP >= 8.2
- Composer >= 2.x
- MySQL 8.x (XAMPP recomendado en Windows)
- MySQL corriendo en `127.0.0.1:3306`

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/<tu-usuario>/arasaka-api.git
cd arasaka-api

# 2. Instalar dependencias
composer install

# 3. Copiar variables de entorno
cp .env.example .env

# 4. Generar la clave de la aplicación
php artisan key:generate
```

Editar `.env` con tus credenciales de MySQL:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=arasaka_health
DB_USERNAME=root
DB_PASSWORD=
DB_COLLATION=utf8mb4_unicode_ci
```

---

## Crear la base de datos

```sql
CREATE DATABASE IF NOT EXISTS arasaka_health
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

---

## Ejecutar migraciones

```bash
php artisan migrate
```

---

## Ejecutar el servidor

```bash
php artisan serve --port=8000
```

El servidor queda disponible en `http://127.0.0.1:8000`.

---

## Endpoints disponibles

Todas las rutas tienen el prefijo `/api/v1/`.

### Autenticación (pública)

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/v1/auth/register` | Registrar usuario (doctor o patient) |
| POST | `/api/v1/auth/login` | Iniciar sesión — devuelve token |
| POST | `/api/v1/auth/logout` | Cerrar sesión (requiere token) |

### Pacientes (requiere token)

| Método | Ruta | Rol requerido | Descripción |
|---|---|---|---|
| GET | `/api/v1/patients` | doctor | Listar todos los pacientes |
| GET | `/api/v1/patients/{id}` | doctor / propio patient | Ver detalle de un paciente |
| PUT | `/api/v1/patients/{id}` | patient (propio) | Actualizar perfil clínico |
| DELETE | `/api/v1/patients/{id}` | doctor | Eliminar paciente |

### Citas (requiere token)

| Método | Ruta | Rol requerido | Descripción |
|---|---|---|---|
| GET | `/api/v1/appointments` | doctor o patient | Listar citas propias |
| POST | `/api/v1/appointments` | patient | Agendar nueva cita |
| PATCH | `/api/v1/appointments/{id}` | doctor o patient | Cambiar estado |
| DELETE | `/api/v1/appointments/{id}` | doctor o patient | Eliminar cita |

---

## Ejemplos de request/response

### POST /api/v1/auth/register

**Request:**
```json
{
  "name": "Brandon Zuñiga",
  "email": "brandon@arasakahealth.mx",
  "password": "Secure123!",
  "password_confirmation": "Secure123!",
  "role": "patient"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Usuario registrado correctamente.",
  "data": {
    "token": "2|aB3kLm9z...",
    "user": {
      "id": 1,
      "name": "Brandon Zuñiga",
      "email": "brandon@arasakahealth.mx",
      "role": "patient",
      "created_at": "2026-03-26T19:00:00.000000Z"
    }
  }
}
```

### POST /api/v1/auth/login

**Request:**
```json
{
  "email": "brandon@arasakahealth.mx",
  "password": "Secure123!"
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Sesión iniciada correctamente.",
  "data": {
    "token": "3|xYzAbC...",
    "user": { "id": 1, "name": "Brandon Zuñiga", "email": "brandon@arasakahealth.mx", "role": "patient" }
  }
}
```

### GET /api/v1/patients — solo doctor

**Headers:** `Authorization: Bearer {token}`

**Response 200:**
```json
{
  "success": true,
  "message": "Pacientes obtenidos correctamente.",
  "data": [
    {
      "id": 1, "name": "Brandon Zuñiga", "email": "brandon@arasakahealth.mx", "role": "patient",
      "profile": { "curp": null, "blood_type": null, "weight_kg": null, "height_cm": null, "phone": null }
    }
  ]
}
```

### POST /api/v1/appointments — solo patient

**Request:**
```json
{
  "doctor_id": 2,
  "scheduled_at": "2026-04-15T10:30:00Z",
  "notes": "Revisión mensual de glucosa."
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Cita agendada correctamente.",
  "data": {
    "id": 1,
    "scheduled_at": "2026-04-15T10:30:00+00:00",
    "status": "pending",
    "notes": "Revisión mensual de glucosa.",
    "patient": { "id": 1, "name": "Brandon Zuñiga" },
    "doctor":  { "id": 2, "name": "Dr. Martinez" }
  }
}
```

---

## Estructura del proyecto

```
arasaka-api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── PatientController.php
│   │   │   └── AppointmentController.php
│   │   └── Requests/
│   │       ├── RegisterRequest.php
│   │       ├── LoginRequest.php
│   │       ├── UpdatePatientRequest.php
│   │       ├── StoreAppointmentRequest.php
│   │       └── UpdateAppointmentRequest.php
│   └── Models/
│       ├── User.php
│       ├── PatientProfile.php
│       └── Appointment.php
├── database/migrations/
│   ├── 0001_01_01_000000_create_users_table.php
│   ├── 2026_03_26_000001_create_patient_profiles_table.php
│   ├── 2026_03_26_000002_create_appointments_table.php
│   └── 2026_03_26_..._create_personal_access_tokens_table.php
├── routes/
│   └── api.php
├── .env
├── composer.json
└── artisan
```

---

## Evidencia de pruebas

Ver colección Postman en `tests/ArasakaHealth.postman_collection.json` (Fase 4).
