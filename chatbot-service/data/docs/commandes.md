# Cycle de vie d'une commande

Une commande passe par les statuts suivants, dans l'ordre :

1. **En attente** — la commande est enregistrée et le stock réservé, en
   attente de confirmation du paiement.
2. **Confirmée** — le paiement a été validé.
3. **Expédiée** — la commande a quitté l'entrepôt, un suivi est disponible.
4. **Livrée** — la commande a été reçue par le client.

Une commande peut aussi être **annulée**, ce qui restitue automatiquement
le stock réservé au catalogue.

Le client peut consulter l'historique et le statut de toutes ses commandes
depuis la page "Mes commandes" de son compte.
