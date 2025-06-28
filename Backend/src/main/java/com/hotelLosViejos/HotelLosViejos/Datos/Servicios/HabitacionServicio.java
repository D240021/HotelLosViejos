package com.hotelLosViejos.HotelLosViejos.Datos.Servicios;

import com.hotelLosViejos.HotelLosViejos.Datos.Interfaces.IHabitacion;
import com.hotelLosViejos.HotelLosViejos.Datos.Repositorios.CaracteristicaRepositorio;
import com.hotelLosViejos.HotelLosViejos.Datos.Repositorios.HabitacionRepositorio;
import com.hotelLosViejos.HotelLosViejos.Dominio.Caracteristica;
import com.hotelLosViejos.HotelLosViejos.Dominio.Habitacion;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HabitacionServicio implements IHabitacion {

    @Autowired
    private final HabitacionRepositorio habitacionRepositorio;

    @Autowired
    private final CaracteristicaRepositorio caracteristicaRepositorio;

    public HabitacionServicio(HabitacionRepositorio habitacionRepositorio, CaracteristicaRepositorio caracteristicaRepositorio) {
        this.habitacionRepositorio = habitacionRepositorio;
        this.caracteristicaRepositorio = caracteristicaRepositorio;
    }

    @Override
    public boolean registrarHabitacion(Habitacion habitacion) {
        try {
            habitacionRepositorio.save(habitacion);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public List<Habitacion> obtenerHabitaciones() {
        return habitacionRepositorio.findAll();
    }

    @Override
    public Habitacion obtenerHabitacionPorId(int id) {
        return habitacionRepositorio.findById(id).orElse(null);
    }

    @Modifying
    @Transactional
    @Override
    public boolean actualizarHabitacion(Habitacion habitacionNueva) {
        try {
            Habitacion habitacionExistente = habitacionRepositorio.findById(habitacionNueva.getId())
                    .orElseThrow(() -> new Exception("Habitación no encontrada"));

            habitacionExistente.setNumero(habitacionNueva.getNumero());
            habitacionExistente.setTarifaDiariaBase(habitacionNueva.getTarifaDiariaBase());
            habitacionExistente.setTipo(habitacionNueva.getTipo());
            habitacionExistente.setEstado(habitacionNueva.getEstado());
            habitacionExistente.setNombreImagen(habitacionNueva.getNombreImagen());
            habitacionExistente.setCaracteristicas(habitacionNueva.getCaracteristicas());

            habitacionRepositorio.save(habitacionExistente);
            return true;

        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean eliminarHabitacion(int idHabitacion) {
        try {
            if (!habitacionRepositorio.existsById(idHabitacion))
                throw new Exception("Habitación no encontrada");

            habitacionRepositorio.deleteById(idHabitacion);
            return true;

        } catch (Exception e) {
            return false;
        }
    }

    @Transactional
    public boolean actualizarEstadoHabitacion(int idHabitacion, Habitacion.EstadoHabitacion nuevoEstado) {
        Habitacion habitacion = habitacionRepositorio.findById(idHabitacion)
                .orElseThrow(() -> new RuntimeException("Habitación no encontrada"));

        habitacion.setEstado(nuevoEstado);
        habitacionRepositorio.save(habitacion);

        return true;
    }

}
