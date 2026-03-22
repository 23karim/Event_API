import jwt from 'jsonwebtoken';
export const auth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log("Authorization Header:", authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Accès refusé. Token manquant ou mal formé.' });
        }

        const token = authHeader.split(' ')[1]; 
        
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        
        req.userId = decodedToken.userId;
        req.userRole = decodedToken.role;
        
        next();
    } catch (error) {
        console.error("Erreur Auth Middleware:", error.message);
        res.status(401).json({ message: 'Requête non authentifiée ou token expiré !' });
    }
};
export const isAdmin = (req, res, next) => {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ 
            message: 'Accès interdit. Vous devez être administrateur pour effectuer cette action.' 
        });
    }
    next();
};
export const isClient = (req, res, next) => {
    if (req.userRole !== 'client') {
        return res.status(403).json({ 
            message: 'Accès refusé. Seuls les clients peuvent s\'inscrire aux événements.' 
        });
    }
    next();
};