"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { differenceInDays } from "date-fns";
import { useHabitacion } from "@/hooks/use-habitacion";
import { useReserva } from "@/hooks/use-reserva";
import type { HabitacionBase } from "@/types/Habitacion";
import { DateSelector } from "./date-selector";
import { RoomTypeSelector } from "./room-type-selector";
import { ReservationSummary } from "./reservation-summary";
import { PersonalInfoForm } from "./personal-info-form";
import { RoomDetail } from "./room-detail";
import { ConfirmationMessage } from "./confirmation-message";
import { AlertMessage } from "../alert";

export function ReservationForm() {
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [roomType, setRoomType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [nights, setNights] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [selectedRoom, setSelectedRoom] = useState<HabitacionBase | null>(null);
  const [step, setStep] = useState<number>(1);
  const [reservationNumber, setReservationNumber] = useState<string>("");
  const [alert, setAlert] = useState<{
    type: "success" | "error" | "info";
    title: string;
    message: string;
  } | null>(null);

  // Campos para el segundo paso
  const { crearReserva } = useReserva();
  const habitaciones = useHabitacion();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [creditCard, setCreditCard] = useState<string>("");
  const [formattedCreditCard, setFormattedCreditCard] = useState<string>("");

  const handleCreditCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");

    setCreditCard(value);

    // Aplicar formato para la visualización (XXXX XXXX XXXX XXXX)
    let formatted = "";
    for (let i = 0; i < value.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += " ";
      }
      formatted += value[i];
    }

    setFormattedCreditCard(formatted);
  };

  // Calcular noches y precio total cuando cambian las fechas o el tipo de habitación
  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nightsCount = differenceInDays(checkOutDate, checkInDate);
      setNights(nightsCount);

      if (roomType && nightsCount > 0) {
        const room = habitaciones.find((h) => h.id.toString() === roomType);
        if (room) {
          setSelectedRoom(room);
          setTotalPrice(room.tarifaDiariaBase * nightsCount);
        }
      }

      const month = new Date().getMonth() + 1;

      if ([4, 7, 8, 12].includes(month)) { // Temporadas alta
        setTotalPrice((prev) => prev * 1.2); 
      }

    } else {
      setNights(0);
      setTotalPrice(0);
    }
  }, [checkInDate, checkOutDate, roomType, habitaciones]);

  const handleFirstStep = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que se hayan seleccionado todas las opciones
    if (!checkInDate || !checkOutDate || !roomType) {
      setAlert({
        type: "error",
        title: "Error",
        message: "Por favor complete todos los campos",
      });
      return;
    }

    // Validar que la fecha de salida sea posterior a la de entrada
    if (checkOutDate <= checkInDate) {
      setAlert({
        type: "error",
        title: "Error",
        message: "La fecha de salida debe ser posterior a la fecha de entrada",
      });
      return;
    }

    // ✅ Si todas las validaciones pasan, se limpia la alerta
    setAlert(null);
    setStep(2);
  };

  const handleSecondStep = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validar que se hayan completado todos los campos
    if (!firstName || !lastName || !email || !creditCard) {
      setAlert({
        type: "error",
        title: "Error",
        message: "Por favor complete todos los campos",
      });
      return;
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setAlert({
        type: "error",
        title: "Error",
        message: "Por favor ingrese un email válido",
      });
      return;
    }

    // Validar que la tarjeta tenga al menos 13 dígitos (estándar mínimo)
    if (creditCard.length < 13) {
      setAlert({
        type: "error",
        title: "Error",
        message: "Por favor ingrese un número de tarjeta válido",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (selectedRoom && checkInDate && checkOutDate) {
        // Realizar la reserva real
        await crearReserva(
          firstName,
          lastName,
          email,
          creditCard,
          selectedRoom.id,
          checkInDate,
          checkOutDate
        );

        // ✅ Si la reserva es exitosa, se limpia la alerta antes de continuar
        setAlert(null);

        // Generar un número de reserva aleatorio
        const generatedNumber =
          Math.random().toString(36).substring(2, 10).toUpperCase() +
          Math.floor(Math.random() * 1000000)
            .toString()
            .padStart(6, "0");
        setReservationNumber(generatedNumber);

        setFormSubmitted(true);
      }
    } catch (error: any) {
      // Verificar el código de error y configurar el mensaje
      if (error.message.includes("Habitacion no disponible")) {
        setAlert({
          type: "error",
          title: "Error",
          message:
            "Ya existe una reserva con esos datos. Por favor seleccione otras fechas.",
        });
      } else {
        setAlert({
          type: "error",
          title: "Error",
          message:
            "Ocurrió un error al procesar su reserva. Por favor intente nuevamente.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    setStep(1);
  };

  if (formSubmitted) {
    return (
      <ConfirmationMessage
        firstName={firstName}
        reservationNumber={reservationNumber}
        email={email}
      />
    );
  }

  // Determinar si mostrar el ticket de reserva en el primer paso
  const showTicket = checkInDate || checkOutDate || roomType;

  return (
    <>
      {alert && (
        <AlertMessage
          type={alert.type}
          title={alert.title}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      {step === 1 && (
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleFirstStep}>
              <DateSelector
                label="Fecha de Llegada"
                selectedDate={checkInDate}
                onDateChange={setCheckInDate}
                minDate={new Date()}
                id="check-in"
              />

              <DateSelector
                label="Fecha de Salida"
                selectedDate={checkOutDate}
                onDateChange={setCheckOutDate}
                minDate={checkInDate || new Date()}
                id="check-out"
              />

              <RoomTypeSelector
                roomType={roomType}
                onRoomTypeChange={setRoomType}
                habitaciones={habitaciones}
              />

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white px-8"
                >
                  Continuar
                </Button>
              </div>
            </form>
          </div>

          {/* Ticket de reserva */}
          {showTicket && (
            <ReservationSummary
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              selectedRoom={selectedRoom}
              nights={nights}
              totalPrice={totalPrice}
            />
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <button
            onClick={goBack}
            className="flex items-center text-teal-600 hover:text-teal-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Volver
          </button>

          <div className="grid md:grid-cols-2 gap-8">
            {selectedRoom && (
              <RoomDetail
                selectedRoom={selectedRoom}
                totalPrice={totalPrice}
                nights={nights}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
              />
            )}

            <div className="bg-white rounded-lg shadow-sm p-6">
              <PersonalInfoForm
                firstName={firstName}
                setFirstName={setFirstName}
                lastName={lastName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                creditCard={creditCard}
                formattedCreditCard={formattedCreditCard}
                handleCreditCardChange={handleCreditCardChange}
                onSubmit={handleSecondStep}
                onBack={goBack}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
