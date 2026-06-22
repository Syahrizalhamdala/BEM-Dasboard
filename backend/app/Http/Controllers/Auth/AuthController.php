<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'nim' => 'required|string|unique:users,nim',
            'email' => 'required|email|regex:/^[a-zA-Z0-9._%+-]+@nusaputra\.ac\.id$/|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'divisi' => 'nullable|string',
            'jabatan' => 'nullable|string',
        ]);

        User::create([
            'name' => $request->nama,
            'nim' => $request->nim,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'divisi' => $request->divisi,
            'jabatan' => $request->jabatan,
            'status' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Registrasi berhasil, silakan login',
        ], 201);
    }

    public function login(Request $request)
    {
        set_time_limit(60);

        $request->validate([
            'email' => 'required|email|regex:/^[a-zA-Z0-9._%+-]+@nusaputra\.ac\.id$/',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Email atau password salah',
            ], 401);
        }

        if ($user->status === 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Akun menunggu persetujuan admin',
            ], 403);
        }

        if ($user->status === 'nonaktif') {
            return response()->json([
                'success' => false,
                'message' => 'Akun dinonaktifkan',
            ], 403);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'success' => true,
            'user' => $user,
            'token' => $token,
            'role' => $user->role,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Berhasil logout',
        ]);
    }

    public function me(Request $request)
    {
        set_time_limit(60);

        return response()->json([
            'success' => true,
            'user' => $request->user(),
        ]);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'string|max:255',
            'email' => 'email|regex:/^[a-zA-Z0-9._%+-]+@nusaputra\.ac\.id$/|unique:users,email,' . $request->user()->id,
            'nim' => 'string|unique:users,nim,' . $request->user()->id,
            'divisi' => 'nullable|string',
            'jabatan' => 'nullable|string',
        ]);

        $user = $request->user();
        $user->update($request->only(['name', 'email', 'nim', 'divisi', 'jabatan']));

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui',
            'user' => $user->fresh(),
        ]);
    }

    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:6|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Password saat ini salah',
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->new_password),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah',
        ]);
    }
}
