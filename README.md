# ArasakaHealth - LITE PARA PROYECTO DE AWOS

Proyecto académico para la materia Aplicaciones Web Orientadas a Servicios.

ArasakaHealth implementa una API REST con Laravel 11 para autenticación, gestión de pacientes y agendamiento de citas médicas, junto con un frontend en React para acceso visual al sistema.

## Framework Elegido + Versión

### Backend

- Framework: Laravel 11
- Lenguaje: PHP 8.4
- Autenticación: Laravel Sanctum 4.x
- ORM: Eloquent ORM
- Base de datos: MySQL 8.x

### Frontend

- Framework: React 19
- Build tool: Vite 8
- Cliente HTTP: Axios
- Enrutamiento: React Router DOM 7

## Estructura del Proyecto

```text
ARASAKAGABO/
├── arasaka-api/        # Backend Laravel 11
├── arasaka-frontend/   # Frontend React + Vite
├── ArasakaHealth_Fase1.docx.txt
└── ArasakaHealth_Fase2.docx.txt
```

## Requisitos para Ejecutar

- PHP >= 8.2
- Composer >= 2.x
- MySQL 8.x o MariaDB compatible
- Node.js >= 18
- npm >= 9
- XAMPP o servicio MySQL activo en `127.0.0.1:3306`

## Cómo Instalar Dependencias

### Backend

```bash
cd arasaka-api
composer install
cp .env.example .env
php artisan key:generate
```

### Frontend

```bash
cd arasaka-frontend
npm install
```

## Configuración de Base de Datos

Crear la base de datos:

```sql
CREATE DATABASE IF NOT EXISTS arasaka_health
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

Configurar `arasaka-api/.env`:

```env
APP_NAME=ArasakaHealthAPI
APP_URL=http://127.0.0.1:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=arasaka_health
DB_USERNAME=root
DB_PASSWORD=
DB_COLLATION=utf8mb4_unicode_ci
```

Ejecutar migraciones:

```bash
cd arasaka-api
php artisan migrate
```

## Cómo Ejecutar

### Backend Laravel

```bash
cd arasaka-api
php artisan serve --port=8000
```

Servidor API:

```text
http://127.0.0.1:8000
```

### Frontend React

```bash
cd arasaka-frontend
npm run dev
```

Servidor frontend:

```text
http://localhost:5173
```

Nota: si el puerto 5173 está ocupado, Vite puede levantar el proyecto en 5174.

## Dependencias que Evidencian el Framework

### Backend (`arasaka-api/composer.json`)

- `laravel/framework: ^11.0`
- `laravel/sanctum: ^4.0`
- `laravel/tinker: ^2.9`

### Frontend (`arasaka-frontend/package.json`)

- `react: ^19.2.4`
- `react-dom: ^19.2.4`
- `react-router-dom: ^7.13.2`
- `vite: ^8.0.1`
- `axios: ^1.13.6`

## Endpoints Disponibles

Base URL:

```text
http://127.0.0.1:8000/api/v1
```

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/auth/register` | Registrar usuario con rol `doctor` o `patient` |
| POST | `/auth/login` | Iniciar sesión y obtener token |
| POST | `/auth/logout` | Cerrar sesión y revocar token actual |

### Pacientes

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| GET | `/patients` | doctor | Listar pacientes |
| GET | `/patients/{id}` | doctor / paciente propio | Ver detalle |
| PUT | `/patients/{id}` | paciente propio | Actualizar perfil |
| DELETE | `/patients/{id}` | doctor | Eliminar paciente |

### Citas

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| GET | `/appointments` | doctor / patient | Listar citas |
| POST | `/appointments` | patient | Crear cita |
| PATCH | `/appointments/{id}` | doctor / patient | Confirmar o cancelar |
| DELETE | `/appointments/{id}` | doctor / patient | Eliminar cita |

## Ejemplos de Request / Response

### Registro de usuario

**Request**

```http
POST /api/v1/auth/register
Content-Type: application/json
Accept: application/json
```

```json
{
  "name": "Brandon Zuniga",
  "email": "brandon@arasakahealth.com",
  "password": "Brandon123!",
  "password_confirmation": "Brandon123!",
  "role": "patient"
}
```

**Response 201**

```json
{
  "success": true,
  "message": "Usuario registrado correctamente.",
  "data": {
    "token": "1|xxxxxxxxxxxxxxxx",
    "user": {
      "id": 3,
      "name": "Brandon Zuniga",
      "email": "brandon@arasakahealth.com",
      "role": "patient"
    }
  }
}
```

### Login

**Request**

```http
POST /api/v1/auth/login
Content-Type: application/json
Accept: application/json
```

```json
{
  "email": "miguel@arasakahealth.com",
  "password": "Miguel123!"
}
```

**Response 200**

```json
{
  "success": true,
  "message": "Sesión iniciada correctamente.",
  "data": {
    "token": "2|xxxxxxxxxxxxxxxx",
    "user": {
      "id": 2,
      "name": "Dr. Miguel",
      "email": "miguel@arasakahealth.com",
      "role": "doctor"
    }
  }
}
```

### Crear cita

**Request**

```http
POST /api/v1/appointments
Authorization: Bearer {token_paciente}
Content-Type: application/json
Accept: application/json
```

```json
{
  "doctor_id": 2,
  "scheduled_at": "2026-06-15 10:00:00",
  "notes": "Control mensual de glucosa"
}
```

**Response 201**

```json
{
  "success": true,
  "message": "Cita agendada correctamente.",
  "data": {
    "id": 10,
    "status": "pending",
    "notes": "Control mensual de glucosa"
  }
}
```

### Error de autenticación

**Request**

```http
GET /api/v1/patients
Accept: application/json
```

**Response 401**

```json
{
  "success": false,
  "message": "No autenticado. Proporciona un token válido.",
  "errors": []
}
```

## Evidencia de Pruebas

La evidencia de pruebas de Fase 4 queda respaldada con:

- Colección Postman importable: `arasaka-api/tests/ArasakaHealth.postman_collection.json`
- Pruebas manuales en Thunder Client / Postman sobre register, login, patients y appointments
- Casos de error validados:
  - `401` sin token
  - `401` login inválido
  - `403` acceso restringido por rol
  - `404` recurso inexistente
  - `422` validación fallida


## Colección Postman

Importar el archivo:

```text
arasaka-api/tests/ArasakaHealth.postman_collection.json
```

Variables sugeridas dentro de Postman:

- `base_url = http://127.0.0.1:8000/api/v1`
- `token_doctor`
- `token_patient`
- `patient_id`
- `doctor_id`
- `appointment_id`

## Criterio de Validación Rápido

### Se considera válido porque:

- El framework se evidencia en `composer.json` y en la estructura estándar de Laravel
- Las rutas están definidas en `arasaka-api/routes/api.php`
- La API corre mediante `php artisan serve`
- La autenticación usa Sanctum y las respuestas son comprobables con Postman o Thunder Client
- El frontend consume la API real desde React

### Se consideraría no válido si:

- Se eliminaran las dependencias de Laravel o React
- No existiera la estructura del framework
- Se ejecutara como scripts sueltos y no mediante Laravel/Vite
- No pudiera comprobarse el flujo con Postman o Thunder Client
