<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Support\PhoneNumber;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class AdminUserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index()
    {
        $users = User::select('id', 'name', 'nim', 'email', 'phone', 'role')
            ->orderBy('name')
            ->paginate(20);
            
        $roles = ['admin', 'user'];
        
        return Inertia::render('Admin/UsersManagement', [
            'users' => $users,
            'roles' => $roles,
        ]);
    }

    /**
     * Update the specified user.
     */
    public function update(Request $request, User $user)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'role' => 'required|in:admin,user',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator);
        }

        // Normalize phone number to E.164 format
        $phone = $request->phone;
        if ($phone) {
            $phone = PhoneNumber::normalizeToE164($phone);
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $phone,
            'role' => $request->role,
        ]);

        return back()->with('success', 'User berhasil diupdate');
    }

    /**
     * Remove the specified user.
     */
    public function destroy(User $user)
    {
        // Prevent admin from deleting themselves
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun sendiri');
        }

        $user->delete();

        return back()->with('success', 'User berhasil dihapus');
    }
}
