package com.hotelLosViejos.HotelLosViejos.Datos.Servicios;

import com.hotelLosViejos.HotelLosViejos.Datos.Interfaces.IReserva;
import com.hotelLosViejos.HotelLosViejos.Datos.Repositorios.ReservaRepositorio;
import com.hotelLosViejos.HotelLosViejos.Dominio.Habitacion;
import com.hotelLosViejos.HotelLosViejos.Dominio.Reserva;
import com.hotelLosViejos.HotelLosViejos.Infraestructura.Excepciones.HabitacionDeshabilitadaExcepcion;
import com.hotelLosViejos.HotelLosViejos.Infraestructura.Excepciones.ReservaExcepcion;
import com.lowagie.text.pdf.PdfWriter;
import com.lowagie.text.pdf.draw.LineSeparator;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;

import static java.awt.Color.BLACK;
import static java.awt.Color.DARK_GRAY;

@Service
public class ReservaServicio implements IReserva {

    @Autowired
    private final ReservaRepositorio reservaRepositorio;
    @Autowired
    private HabitacionServicio habitacionServicio;

    @Autowired
    public ReservaServicio(ReservaRepositorio reservaRepositorio, HabitacionServicio habitacionServicio) {
        this.reservaRepositorio = reservaRepositorio;
        this.habitacionServicio = habitacionServicio;
    }

    @Override
    @Transactional
    public boolean registrarReserva(Reserva reserva) {

        Habitacion habitacion = reserva.getHabitacion();

        // Validar si está deshabilitada
        if (habitacion.getEstado() == Habitacion.EstadoHabitacion.DESHABILITADA) {
            throw new HabitacionDeshabilitadaExcepcion("La habitacion se encuentra deshabilitada");
        }

        // Validar solapamientos
        boolean disponible = estaDisponible(habitacion, reserva.getFechaLlegada(), reserva.getFechaSalida(), -1);
        if (!disponible) {
            throw new ReservaExcepcion("Habitación no disponible");
        }

        this.reservaRepositorio.save(reserva);

        habitacionServicio.actualizarEstadoHabitacion(reserva.getHabitacion().getId(), Habitacion.EstadoHabitacion.OCUPADA);

        return true;
    }


    @Modifying
    @Transactional
    @Override
    public boolean actualizarReserva(Reserva reserva) {
        try {
            Reserva existente = this.reservaRepositorio.findById(reserva.getId())
                    .orElseThrow(() -> new Exception("Reserva no encontrada"));

            if (!estaDisponible(reserva.getHabitacion(), reserva.getFechaLlegada(), reserva.getFechaSalida(), reserva.getId())) {
                throw new ReservaExcepcion("Habitacion no disponible");
            }

            this.reservaRepositorio.save(reserva);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public boolean eliminarReserva(int idReserva) {
        try {
            if (!this.reservaRepositorio.existsById(idReserva))
                throw new Exception("Reserva no encontrada");

            this.reservaRepositorio.deleteById(idReserva);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public List<Reserva> obtenerReservas() {
        return this.reservaRepositorio.findAll();
    }

    @Override
    public Reserva obtenerReservaPorId(int id) {
        return this.reservaRepositorio.findById(id).orElse(null);
    }

    @Override
    public boolean estaDisponible(Habitacion habitacion, LocalDateTime llegada, LocalDateTime salida) {
        return estaDisponible(habitacion, llegada, salida, -1);
    }

    @Override
    public boolean estaDisponible(Habitacion habitacion, LocalDateTime llegada, LocalDateTime salida, int idActual) {

        // Verificar estado de la habitación
        if (habitacion.getEstado() == Habitacion.EstadoHabitacion.DESHABILITADA) {
            return false;
        }

        // Verificar fechas de reservas existentes
        List<Reserva> reservas = reservaRepositorio.findByHabitacion(habitacion);

        for (Reserva r : reservas) {
            if (r.getId() == idActual) continue;

            LocalDateTime existenteInicio = r.getFechaLlegada();
            LocalDateTime existenteFin = r.getFechaSalida();

            // Permitir solo si la nueva reserva termina antes o empieza después SIN solapamiento
            if (!(salida.isBefore(existenteInicio) || llegada.isAfter(existenteFin) || llegada.equals(existenteFin))) {
                return false;
            }
        }

        return true;
    }


    private ByteArrayOutputStream obtenerEstilosPDFReserva(Reserva reservaEncontrada) {

        ByteArrayOutputStream salida = new ByteArrayOutputStream();

        try {
            Font tituloFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, BLACK);
            Font contenidoFont = FontFactory.getFont(FontFactory.HELVETICA, 12, DARK_GRAY);
            LineSeparator separador = new LineSeparator();


            Document document = new Document();
            PdfWriter.getInstance(document, salida);
            document.open();

            Image logo = Image.getInstance(getClass().getResource("/static/imagenes/logoHotel.png"));
            logo.setAlignment(Image.ALIGN_CENTER);
            logo.scaleToFit(100, 100);
            document.add(logo);

            Paragraph titulo = new Paragraph("Detalles de la Reserva", tituloFont);
            titulo.setAlignment(Element.ALIGN_CENTER);
            document.add(titulo);

            document.add(new Chunk(separador));

            Paragraph idReserva = new Paragraph("Número de la Reserva: " + reservaEncontrada.getNumeroReserva(), contenidoFont);
            idReserva.setAlignment(Element.ALIGN_CENTER);
            document.add(idReserva);

            Paragraph cliente = new Paragraph("Nombre del Cliente: " + reservaEncontrada.getCliente().getNombre() + "  "
                    + reservaEncontrada.getCliente().getApellidos(), contenidoFont);
            cliente.setAlignment(Element.ALIGN_CENTER);
            document.add(cliente);

            Paragraph fechaEntrada = new Paragraph("Fecha de Entrada: " + reservaEncontrada.getFechaLlegada(), contenidoFont);
            fechaEntrada.setAlignment(Element.ALIGN_CENTER);
            document.add(fechaEntrada);

            Paragraph fechaSalida = new Paragraph("Fecha de Salida: " + reservaEncontrada.getFechaSalida(), contenidoFont);
            fechaSalida.setAlignment(Element.ALIGN_CENTER);
            document.add(fechaSalida);

            Paragraph habitacion = new Paragraph("Habitación: " + reservaEncontrada.getHabitacion().getNumero(), contenidoFont);
            habitacion.setAlignment(Element.ALIGN_CENTER);
            document.add(habitacion);

            document.close();

            return salida;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public byte[] obtenerPDFReserva(int id) {

        Reserva reservaEncontrada = this.reservaRepositorio.findById(id).orElse(null);

        ByteArrayOutputStream salida = this.obtenerEstilosPDFReserva(reservaEncontrada);

        return salida.toByteArray();

    }

}
