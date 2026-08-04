-- À exécuter après avoir enregistré un compte via POST /api/auth/register
-- (tous les comptes créés via l'API sont CLIENT par défaut).

UPDATE users SET role = 'ADMIN' WHERE email = 'admin@test.com';

-- Vérification :
SELECT id, email, role FROM users;
