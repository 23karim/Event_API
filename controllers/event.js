
import Event from "../models/event.js"; 
import cloudinary from "../middlewares/cloudinary.js";

export const addEvent = async (req, res) => {
  try {
    const { titre, description, date_debut, date_fin, prix, lieu } = req.body;
    const admin_id = req.userId; 
    if (!titre || !date_debut || !date_fin || !lieu || prix === undefined) {
      return res.status(400).json({ 
        message: "Le titre, la date de début, la date de fin, le prix et le lieu sont obligatoires." 
      });
    }

    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "events",
        resource_type: "image"
      });
      imageUrl = result.secure_url;
    }

    const newEvent = await Event.create({
      titre,
      description,
      date_debut,
      date_fin,
      prix,
      lieu,
      image: imageUrl,
      admin_id
    });

    res.status(201).json({
      message: "Événement créé avec succès !",
      event: newEvent
    });
  } catch (error) {
    console.error("Erreur AddEvent:", error);
    res.status(500).json({ message: "Erreur lors de la création de l'événement." });
  }
};
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.getById(id);
    if (!event) {
      return res.status(404).json({ message: "Événement introuvable." });
    }

    if (event.image) {
      const publicId = event.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`events/${publicId}`).catch(err => 
        console.error("Erreur suppression image Cloudinary:", err)
      );
    }

    const deletedEvent = await Event.delete(id);

    res.status(200).json({ 
      message: "Événement supprimé avec succès !",
      event: deletedEvent 
    });
  } catch (error) {
    console.error("Erreur DeleteEvent:", error);
    res.status(500).json({ message: "Erreur lors de la suppression." });
  }
};
export const deleteAllEvents = async (req, res) => {
  try {
    const deletedEvents = await Event.deleteAll();
    res.status(200).json({ 
      message: "Tous les événements ont été supprimés.",
      count: deletedEvents?.length || 0
    });
  } catch (error) {
    console.error("Erreur DeleteAllEvents:", error);
    res.status(500).json({ message: "Erreur lors de la suppression massive." });
  }
};
export const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { events, total } = await Event.getAll(limit, offset);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      pagination: {
        totalItems: total,
        totalPages: totalPages,
        currentPage: page,
        itemsPerPage: limit,
      },
      events
    });
  } catch (error) {
    console.error("Erreur GetAllEvents:", error);
    res.status(500).json({ message: "Erreur lors de la récupération des événements." });
  }
};
export const getEventById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "ID invalide." });

    const event = await Event.getById(id);
    if (!event) return res.status(404).json({ message: "Événement introuvable." });

    res.status(200).json(event);
  } catch (error) {
    console.error("Erreur GetEventById:", error);
    res.status(500).json({ message: "Erreur lors de la récupération." });
  }
};