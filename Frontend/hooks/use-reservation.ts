"use client";

import { useState, useEffect } from "react";
import { differenceInDays } from "date-fns";
import { useHabitacion } from "@/hooks/use-habitacion";
import { useReserva } from "@/hooks/use-reserva";
import { useTemporadaStore } from "@/lib/seasonData";
import { useOferta } from "@/hooks/use-ofertas";
import type { HabitacionBase } from "@/types/Habitacion";

export function useReservation() {
  const { altaPercentage, bajaPercentage } = useTemporadaStore();
  const { crearReserva } = useReserva();
  const { habitaciones } = useHabitacion();
  const { offers } = useOferta();

  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [roomType, setRoomType] = useState("");
  const [step, setStep] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<HabitacionBase | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [nights, setNights] = useState(0);
  const [alert, setAlert] = useState<{
    type: string;
    title: string;
    message: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);
  const [appliedOffer, setAppliedOffer] = useState<{
    title: string;
    percentage: number;
  } | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [creditCard, setCreditCard] = useState("");
  const [formattedCreditCard, setFormattedCreditCard] = useState("");

  const handleCreditCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCreditCard(value);
    setFormattedCreditCard(value.replace(/(\d{4})(?=\d)/g, "$1 "));
  };

  useEffect(() => {
    if (checkInDate && checkOutDate) {
      const nightsCount = differenceInDays(checkOutDate, checkInDate);
      setNights(nightsCount);

      if (roomType && nightsCount > 0) {
        const room = habitaciones.find((h) => h.id.toString() === roomType);
        if (room) {
          setSelectedRoom(room);

          const month = new Date(checkInDate).getMonth() + 1;
          const isAlta = [4, 7, 8, 12].includes(month);
          const seasonPercent = isAlta ? altaPercentage : bajaPercentage;
          const baseNumber =
            typeof room.tarifaDiariaBase === "number"
              ? room.tarifaDiariaBase
              : parseFloat(room.tarifaDiariaBase as unknown as string);
          const base = baseNumber * (1 + Number(seasonPercent) / 100);

          const applicableOffer = offers.find((offer) => {
            if (!offer.aplica) return false;
            const appliesTo = offer.aplica.toLowerCase();
            const applies =
              appliesTo === "todas" || appliesTo === room.tipo.toLowerCase();

            const fi = offer.fechaInicio ? new Date(offer.fechaInicio) : null;
            const ff = offer.fechaFin ? new Date(offer.fechaFin) : null;

            return (
              applies && fi && ff && checkInDate >= fi && checkOutDate <= ff
            );
          });

          if (applicableOffer?.porcentaje) {
            const d = applicableOffer.porcentaje;
            setTotalPrice((base - base * (d / 100)) * nightsCount);
            setAppliedOffer({
              title: applicableOffer.titulo ?? "",
              percentage: d,
            });
          } else {
            setTotalPrice(base * nightsCount);
            setAppliedOffer(null);
          }
        }
      }
    } else {
      setTotalPrice(0);
      setSelectedRoom(null);
      setAppliedOffer(null);
    }
  }, [
    checkInDate,
    checkOutDate,
    roomType,
    habitaciones,
    altaPercentage,
    bajaPercentage,
    offers,
  ]);

  const handleFirstStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !checkInDate ||
      !checkOutDate ||
      !roomType ||
      checkOutDate <= checkInDate
    ) {
      setAlert({
        type: "error",
        title: "Error",
        message: "Complete todos los campos correctamente.",
      });
      return;
    }

    setAlert(null);
    setStep(2);
  };

  const handleSecondStep = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    creditCard: string;
  }) => {
    const { firstName, lastName, email, creditCard } = data;

    if (!firstName || !lastName || !email || creditCard.length < 13) {
      setAlert({
        type: "error",
        title: "Error",
        message: "Complete todos los campos correctamente.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      if (selectedRoom && checkInDate && checkOutDate) {
        const reserva = await crearReserva(
          firstName,
          lastName,
          email,
          creditCard,
          selectedRoom.id,
          checkInDate,
          checkOutDate
        );
        console.log("📦 Reserva creada →", reserva);
        if (!reserva?.id) {
          throw new Error("Reserva inválida: no tiene ID.");
        }
        setReservationId(reserva.id);
        setFormSubmitted(true);
        setAlert(null);
      }
    } catch (err: any) {
      let msg = "Ocurrió un error al procesar la reserva.";
      if (err.message.includes("Habitacion no disponible")) {
        msg = "Ya existe una reserva con esas fechas. Seleccione otras fechas.";
      } else if (
        err.message.includes("La habitacion se encuentra deshabilitada")
      ) {
        msg =
          "La habitación seleccionada no se encuentra disponible. Por favor, elija otra.";
      }

      console.error("❌ Error al crear reserva:", err);
      setAlert({ type: "error", title: "Error", message: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    checkInDate,
    setCheckInDate,
    checkOutDate,
    setCheckOutDate,
    roomType,
    setRoomType,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    creditCard,
    formattedCreditCard,
    handleCreditCardChange,
    nights,
    totalPrice,
    alert,
    setAlert,
    selectedRoom,
    step,
    setStep,
    appliedOffer,
    handleFirstStep,
    handleSecondStep,
    isSubmitting,
    formSubmitted,
    reservationId,
  };
}
