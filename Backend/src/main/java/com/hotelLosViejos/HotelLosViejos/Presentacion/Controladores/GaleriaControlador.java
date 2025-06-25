package com.hotelLosViejos.HotelLosViejos.Presentacion.Controladores;

import com.hotelLosViejos.HotelLosViejos.Datos.Interfaces.IGaleria;
import com.hotelLosViejos.HotelLosViejos.Dominio.Galeria;
import com.hotelLosViejos.HotelLosViejos.Presentacion.DTOs.Galeria.GaleriaActualizacionDTO;
import com.hotelLosViejos.HotelLosViejos.Presentacion.DTOs.Galeria.GaleriaLecturaDTO;
import com.hotelLosViejos.HotelLosViejos.Presentacion.DTOs.Galeria.GaleriaMapperDTO;
import com.hotelLosViejos.HotelLosViejos.Presentacion.DTOs.Galeria.GaleriaRegistroDTO;
import jakarta.validation.constraints.Min;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/galeria")
public class GaleriaControlador {

    @Autowired
    private final IGaleria iGaleria;

    public GaleriaControlador(IGaleria iGaleria) {
        this.iGaleria = iGaleria;
    }

    @PostMapping
    public ResponseEntity<Boolean> registrarGaleria( @RequestBody GaleriaRegistroDTO galeriaRegistroDTO){

        Galeria galeria = GaleriaMapperDTO.convertirGaleriaRegistroDTOAGaleria(galeriaRegistroDTO);

        return ResponseEntity.created(null).body(this.iGaleria.registrarGaleria(galeria));

    }

    @GetMapping
    public ResponseEntity<List<GaleriaLecturaDTO>> obtenerGalerias(){
        return ResponseEntity.
                ok(GaleriaMapperDTO.convertirGaleriasAGaleriasLecturaDTO
                        (this.iGaleria.obtenerGalerias()));
    }

    @PutMapping
    public ResponseEntity<List<GaleriaLecturaDTO>> actualizarGaleria( @RequestBody List<GaleriaActualizacionDTO> galeriaActualizacionDTO){

        List<Galeria> galeria = GaleriaMapperDTO.convertirGaleriasActualizacionDTOAGalerias(galeriaActualizacionDTO);

        return ResponseEntity.ok(GaleriaMapperDTO.convertirGaleriasAGaleriasLecturaDTO(this.iGaleria.actualizarGalerias(galeria)));

    }

    @DeleteMapping("/{idGaleria}")
    public ResponseEntity<Boolean> eliminarGaleria(@Min(value=1, message = "{galeria.id.mayor1}")
                                                       @PathVariable int idGaleria){

        return ResponseEntity.ok(this.iGaleria.eliminarGaleria(idGaleria));

    }
}
