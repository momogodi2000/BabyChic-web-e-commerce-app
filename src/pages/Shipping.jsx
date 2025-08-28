import { useTranslation } from 'react-i18next'

export default function Shipping() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Livraison & Expédition</h1>

      <p className="mb-6 text-gray-700 dark:text-gray-300">{t('shipping.intro', 'Tout ce qu\'il faut savoir sur la livraison : options, délais, coûts et suivi de colis.')}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Options de livraison</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>Standard :</strong> Livraison en 3–7 jours ouvrés, prix économique.</p>
          <p><strong>Express :</strong> Livraison en 1–2 jours ouvrés selon zone, tarif plus élevé.</p>
          <p><strong>Retrait en boutique :</strong> Vérifiez la disponibilité en boutique et choisissez l\'option au checkout.</p>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Coûts et taxes</h3>
        <p className="text-gray-700 dark:text-gray-300">Les frais de livraison sont calculés automatiquement lors du paiement. Les taxes ou frais douaniers applicables pour les livraisons internationales sont à la charge du client, sauf indication contraire.</p>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Suivi de commande</h3>
        <p className="text-gray-700 dark:text-gray-300">Dès l\'expédition, vous recevrez un e-mail avec le numéro de suivi. Utilisez ce numéro pour suivre le colis sur le site du transporteur. Si vous ne recevez pas le suivi, contactez le support.</p>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Problèmes à la livraison</h3>
        <p className="text-gray-700 dark:text-gray-300">Si votre colis est en retard, endommagé ou manquant, signalez-le immédiatement au support en fournissant votre numéro de commande et des photos si nécessaire. Nous enquêterons et vous assisterons pour une résolution rapide.</p>
      </section>
    </div>
  )
}
