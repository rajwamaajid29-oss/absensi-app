<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('karyawans', function (Blueprint $table) {

            $table->id();

            $table->string('employee_id')->unique();

            $table->string('name');

            $table->string('email')->unique();

            // ✅ PASSWORD
            $table->string('password');

            $table->string('phone')->nullable();

            $table->string('jabatan');

            $table->string('department');

            $table->enum('status', [
                'active',
                'leave',
                'inactive'
            ])->default('active');

            $table->date('join_date');

            $table->string('avatar')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('karyawans');
    }
};
