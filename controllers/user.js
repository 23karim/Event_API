import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const signup = async (req, res) => {
  try {
    const { nom, prenom, email, password, tel, role } = req.body;
    const userExists = await User.findByEmail(email); 
    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé." });
    }
    const imagePath = req.file ? `/img/${req.file.filename}` : null;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      nom,
      prenom,
      email,
      password: hashedPassword, 
      tel,
      role,
      image: imagePath,
    });
    delete newUser.password;
    res.status(201).json({
      message: "Utilisateur créé avec succès !",
      user: newUser,
    });

  } catch (error) {
    console.error("Erreur Signup:", error);
    res.status(500).json({ message: "Erreur lors de l'inscription", error: error.message });
  }
};
export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect." });
    }
    const payload = { userId: user.id, role: user.role };
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "24h" } 
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Connexion réussie !",
      user: {
        id: user.id,
        nom: user.nom,
        role: user.role
      },
      accessToken: accessToken,
      refreshToken: refreshToken
    });

  } catch (error) {
    console.error("Erreur Signin:", error);
    res.status(500).json({ message: "Erreur lors de la connexion." });
  }
};
