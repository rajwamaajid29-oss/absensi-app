<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {

            $table->id();

            $table->foreignId('karyawan_id')
                ->constrained('karyawans')
                ->cascadeOnDelete();

            $table->date('date');

            $table->time('check_in')->nullable();

            $table->time('check_out')->nullable();

            $table->string('latitude')->nullable();

            $table->string('longitude')->nullable();

            $table->longText('photo')->nullable();

            $table->string('qr')->nullable();

            $table->text('checkout_note')->nullable();

            $table->boolean('auto_checkin')
                ->default(false);

            $table->boolean('auto_checkout')
                ->default(false);

            $table->enum('status', [

                'on_time',
                'late',
                'leave',
                'alpha'

            ])->default('on_time');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
