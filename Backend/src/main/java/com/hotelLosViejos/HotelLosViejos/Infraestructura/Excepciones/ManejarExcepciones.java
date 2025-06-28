package com.hotelLosViejos.HotelLosViejos.Infraestructura.Excepciones;

import com.hotelLosViejos.HotelLosViejos.Presentacion.DTOs.Excepciones.ExcepcionDTO;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ManejarExcepciones {

    @ExceptionHandler(ReservaExcepcion.class)
    public ResponseEntity<ExcepcionDTO> manejarReservaExcepcion(ReservaExcepcion e){
        return ResponseEntity.unprocessableEntity().body(new ExcepcionDTO(e.getMessage()));
    }

    @ExceptionHandler(HabitacionDeshabilitadaExcepcion.class)
    public ResponseEntity<ExcepcionDTO> manejarHabitacionDeshabilitadaExcepcion(HabitacionDeshabilitadaExcepcion e){
        return ResponseEntity.status(HttpStatusCode.valueOf(410)).body(new ExcepcionDTO(e.getMessage()));
    }

}
