import { useTranslation } from 'react-i18next'

export default function HelpFAQ() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Aide & FAQ</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">{t('help.intro', 'Retrouvez ici les réponses aux questions les plus fréquentes et des guides pratiques pour acheter, payer et retourner en toute sérénité.')}</p>

      <nav className="mb-8">
        <ul className="flex flex-wrap gap-4 text-sm">
          <li><a className="text-primary-600 hover:underline" href="#orders">Commandes</a></li>
          <li><a className="text-primary-600 hover:underline" href="#payments">Paiements</a></li>
          <li><a className="text-primary-600 hover:underline" href="#shipping">Livraison</a></li>
          <li><a className="text-primary-600 hover:underline" href="#returns">Retours</a></li>
          <li><a className="text-primary-600 hover:underline" href="#account">Compte & Sécurité</a></li>
          <li><a className="text-primary-600 hover:underline" href="#contact">Contact</a></li>
        </ul>
      </nav>

      <section id="orders" className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Commandes</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>Comment passer une commande ?</strong> — Parcourez notre catalogue, choisissez la taille et la couleur, ajoutez au panier puis validez votre commande via le panier. Lors du paiement, confirmez vos coordonnées et mode de livraison.</p>
          <p><strong>Puis-je modifier ou annuler ma commande ?</strong> — Vous pouvez modifier ou annuler votre commande tant qu'elle n'a pas été traitée par notre entrepôt. Contactez le support immédiatement avec votre numéro de commande.</p>
          <p><strong>Comment suivre ma commande ?</strong> — Après expédition, vous recevrez un e-mail contenant le numéro de suivi et un lien pour suivre la livraison.</p>
        </div>
      </section>

      <section id="payments" className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Paiements</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p><strong>Quels modes de paiement acceptez-vous ?</strong> — Nous acceptons Orange Money, MTN MoMo et paiements par carte (Visa/Mastercard) via notre prestataire partenaire.</p>
          <p><strong>Le paiement est-il sécurisé ?</strong> — Oui. Nous utilisons des connexions chiffrées (HTTPS) et un prestataire de paiement conforme aux normes de l'industrie pour protéger vos données.</p>
          <p><strong>Quand serai-je débité ?</strong> — Le prélèvement s'effectue au moment de la confirmation de la commande. En cas d'échec, vous serez informé pour reprendre le paiement.</p>
        </div>
      </section>

      <section id="shipping" className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Livraison</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Nous proposons plusieurs modes de livraison : standard (3–7 jours ouvrés) et express (1–2 jours selon la zone). Les délais peuvent varier en périodes de forte demande.</p>
          <p>Les frais d'expédition sont calculés au checkout en fonction du poids et de la destination.</p>
        </div>
      </section>

      <section id="returns" className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Retours & Remboursements</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Vous pouvez retourner les articles non portés et avec leurs étiquettes dans un délai de 14 jours après réception. Les remboursements sont traités dans un délai de 7 à 14 jours ouvrés après réception du colis retour.</p>
          <p>Pour initier un retour, connectez-vous à votre compte, rendez-vous dans vos commandes et suivez la procédure, ou contactez notre support.</p>
        </div>
      </section>

      <section id="account" className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Compte & Sécurité</h2>
        <div className="space-y-3 text-gray-700 dark:text-gray-300">
          <p>Protégez votre compte : choisissez un mot de passe fort et n'utilisez pas le même mot de passe sur plusieurs services. Nous recommandons d'activer la vérification en deux étapes lorsqu'elle est disponible.</p>
          <p>Si vous suspectez une activité frauduleuse, changez votre mot de passe immédiatement et contactez notre support.</p>
        </div>
      </section>

      <section id="contact" className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Contact</h2>
        <p className="text-gray-700 dark:text-gray-300">Pour toute question ou assistance, utilisez notre page de contact ou écrivez à <a className="text-primary-600" href="mailto:contact@babychic.cm">contact@babychic.cm</a>. Notre équipe support est disponible du lundi au vendredi.</p>
      </section>
    </div>
  )
}
