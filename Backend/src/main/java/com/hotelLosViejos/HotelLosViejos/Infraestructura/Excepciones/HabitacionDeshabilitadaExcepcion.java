package com.hotelLosViejos.HotelLosViejos.Infraestructura.Excepciones;

public class HabitacionDeshabilitadaExcepcion extends RuntimeException {
    public HabitacionDeshabilitadaExcepcion(String mensaje) {
        super(mensaje);
    }
}
