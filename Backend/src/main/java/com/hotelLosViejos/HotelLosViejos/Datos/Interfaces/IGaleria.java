package com.hotelLosViejos.HotelLosViejos.Datos.Interfaces;

import com.hotelLosViejos.HotelLosViejos.Dominio.Facilidad;
import com.hotelLosViejos.HotelLosViejos.Dominio.Galeria;

import java.util.List;

public interface IGaleria {

    public boolean registrarGaleria(Galeria galeria);

    public List<Galeria> obtenerGalerias();

    public List<Galeria> actualizarGalerias(List<Galeria> galeria);

    public boolean eliminarGaleria(int idGaleria);
}
