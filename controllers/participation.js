import Participation from "../models/participation.js";

export const joinEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.userId; 

    const alreadyJoined = await Participation.checkIfAlreadyParticipating(userId, eventId);
    if (alreadyJoined) {
      return res.status(400).json({ message: "Vous participez déjà à cet événement !" });
    }

    const result = await Participation.add(userId, eventId);
    res.status(201).json({ message: "Participation confirmée !", data: result });

  } catch (error) {
    console.error("Erreur Participation:", error);
    res.status(500).json({ message: "Erreur lors de l'inscription à l'événement." });
  }
};

export const getEventParticipants = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
      return res.status(400).json({ message: "ID d'événement invalide." });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { participants, total } = await Participation.getParticipantsByEvent(eventId, limit, offset);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      event_id: eventId,
      pagination: {
        totalParticipants: total,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
      participants: participants.map(user => ({
        id: user.id,
        fullName: `${user.prenom} ${user.nom.toUpperCase()}`,
        email: user.email,
        telephone: user.tel || "Non renseigné",
        participated_at: user.participated_at,
        image: user.image 
          ? (user.image.startsWith('http') ? user.image : `${req.protocol}://${req.get('host')}${user.image}`)
          : null
      }))
    });
  } catch (error) {
    console.error("Erreur GetParticipants:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des participants." });
  }
};

export const getUserParticipations = async (req, res) => {
  try {
    const userId = req.userId; 
    const events = await Participation.getMyParticipations(userId);

    res.status(200).json({
      count: events.length,
      events: events.map(event => ({
        ...event,

        participants_count: parseInt(event.participants_count) || 0,
        image: event.image 
          ? (event.image.startsWith('http') ? event.image : `${req.protocol}://${req.get('host')}${event.image}`)
          : null
      }))
    });
  } catch (error) {
    console.error("Erreur GetUserParticipations:", error);
    res.status(500).json({ message: "Impossible de récupérer vos participations." });
  }
};
export const leaveEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.userId; // Récupéré via ton middleware d'auth

    if (isNaN(eventId)) {
      return res.status(400).json({ message: "ID d'événement invalide." });
    }

    // On vérifie d'abord si la participation existe
    const alreadyJoined = await Participation.checkIfAlreadyParticipating(userId, eventId);
    
    if (!alreadyJoined) {
      return res.status(404).json({ message: "Vous ne participez pas à cet événement." });
    }

    // Suppression
    await Participation.delete(userId, eventId);

    res.status(200).json({ 
      message: "Vous vous êtes désinscrit avec succès de l'événement." 
    });

  } catch (error) {
    console.error("Erreur Annulation Participation:", error);
    res.status(500).json({ message: "Erreur lors de la désinscription." });
  }
};