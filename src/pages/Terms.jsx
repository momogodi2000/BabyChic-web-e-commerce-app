import { useTranslation } from 'react-i18next'

export default function Terms() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Conditions d'Utilisation</h1>

      <p className="mb-6 text-gray-700 dark:text-gray-300">{t('terms.intro', 'Veuillez lire attentivement ces conditions d\'utilisation avant d\'utiliser notre site. Elles régissent votre accès et votre utilisation.')}</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">1. Acceptation des conditions</h2>
        <p className="text-gray-700 dark:text-gray-300">En accédant au site, vous acceptez d\'être lié par ces conditions. Si vous n\'êtes pas d\'accord, n\'utilisez pas le site.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">2. Utilisation du site</h2>
        <p className="text-gray-700 dark:text-gray-300">Vous vous engagez à utiliser le site conformément à la loi et à ne pas porter atteinte aux droits d\'autrui.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">3. Propriété intellectuelle</h2>
        <p className="text-gray-700 dark:text-gray-300">Le contenu du site (textes, images, logos, bases de données) est protégé. Toute reproduction sans autorisation est interdite.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">4. Responsabilités</h2>
        <p className="text-gray-700 dark:text-gray-300">Nous faisons nos meilleurs efforts pour fournir des informations exactes mais ne garantissons pas l\'absence d\'erreurs. Nous déclinons toute responsabilité en cas de dommage indirect.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">5. Données personnelles</h2>
        <p className="text-gray-700 dark:text-gray-300">La collecte et le traitement des données personnelles sont décrits dans notre politique de confidentialité. En utilisant le site, vous consentez à la collecte de données selon cette politique.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">6. Modifications</h2>
        <p className="text-gray-700 dark:text-gray-300">Nous pouvons modifier ces conditions; les mises à jour seront publiées sur cette page. Il vous appartient de vérifier régulièrement les changements.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">7. Contact</h2>
        <p className="text-gray-700 dark:text-gray-300">Pour toute question juridique ou demande, contactez-nous à <a className="text-primary-600" href="mailto:legal@babychic.cm">legal@babychic.cm</a>.</p>
      </section>
    </div>
  )
}
