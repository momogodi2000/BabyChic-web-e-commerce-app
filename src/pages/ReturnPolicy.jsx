import { useTranslation } from 'react-i18next'

export default function ReturnPolicy() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Politique de Retour</h1>

      <p className="mb-6 text-gray-700 dark:text-gray-300">{t('returnPolicy.intro', 'Chez BabyChic, nous voulons que vous soyez entièrement satisfait de votre achat. Si un article ne vous convient pas, voici notre politique et la procédure à suivre.')}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Résumé rapide</h2>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
          <li>Retour accepté sous 14 jours après livraison.</li>
          <li>Article non porté, avec étiquettes et dans son emballage d'origine.</li>
          <li>Remboursement dans les 7–14 jours après réception du colis retour.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Conditions détaillées</h3>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>État du produit :</strong> Les articles doivent être retournés dans l\'état où ils ont été reçus, non portés, non lavés et avec toutes les étiquettes attachées.</p>
          <p><strong>Exceptions :</strong> Les sous-vêtements, maillots de bain ou articles listés comme non-retournables ne sont pas éligibles au retour pour des raisons d'hygiène, sauf en cas de défaut de fabrication.</p>
          <p><strong>Produits défectueux :</strong> Si vous recevez un produit défectueux ou incorrect, contactez le support avec photos et description, nous organiserons l\'échange ou le remboursement sans frais.</p>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Procédure de retour</h3>
        <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>Connectez-vous à votre compte, allez dans la section <em>Mes commandes</em> et sélectionnez la commande concernée.</li>
          <li>Choisissez l'article à retourner et suivez les étapes pour créer une demande de retour.</li>
          <li>Imprimez l'étiquette de retour fournie ou suivez les instructions pour le dépôt en point relais.</li>
          <li>Expédiez le colis et conservez le numéro de suivi jusqu'au remboursement.</li>
        </ol>
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Remboursements</h3>
        <p className="text-gray-700 dark:text-gray-300">Les remboursements sont effectués via le mode de paiement original dans un délai de 7 à 14 jours ouvrés après réception et vérification des articles retournés. Les frais d'expédition initiaux ne sont généralement pas remboursés, sauf en cas d'erreur de notre part.</p>
      </section>
    </div>
  )
}
