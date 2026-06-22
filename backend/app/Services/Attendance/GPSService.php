<?php

namespace App\Services\Attendance;

use App\Models\Setting;

class GPSService
{
    private float $campusLat;
    private float $campusLon;
    private float $maxRadius;

    public function __construct()
    {
        $this->campusLat = (float) (Setting::get('campus_latitude') ?? '-6.8564');
        $this->campusLon = (float) (Setting::get('campus_longitude') ?? '107.5889');
        $this->maxRadius = (float) (Setting::get('campus_radius') ?? '100');
    }

    public function haversine(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371000;

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $a = sin($dLat / 2) ** 2
            + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * sin($dLon / 2) ** 2;

        $c = 2 * asin(sqrt($a));

        return $earthRadius * $c;
    }

    public function distanceFromCampus(float $latitude, float $longitude): float
    {
        return $this->haversine(
            $latitude, $longitude,
            $this->campusLat, $this->campusLon
        );
    }

    public function isWithinRadius(float $latitude, float $longitude): bool
    {
        $distance = $this->distanceFromCampus($latitude, $longitude);
        return $distance <= $this->maxRadius;
    }

    public function getCampusCoordinates(): array
    {
        return [
            'latitude' => $this->campusLat,
            'longitude' => $this->campusLon,
            'radius' => $this->maxRadius,
        ];
    }
}
