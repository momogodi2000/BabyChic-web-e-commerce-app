import { useTranslation } from 'react-i18next'

export default function SizeGuide() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Guide des Tailles</h1>
      <p className="mb-6 text-gray-700 dark:text-gray-300">{t('sizeGuide.intro', 'Guide des tailles complet pour bébés, enfants et femmes — conseils de mesure et équivalences.')}</p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">Comment mesurer</h2>
        <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li><strong>Tour de poitrine :</strong> Mesurez autour de la partie la plus large de la poitrine.</li>
          <li><strong>Tour de taille :</strong> Mesurez à l'endroit le plus fin du tronc.</li>
          <li><strong>Tour de hanches :</strong> Mesurez autour de la partie la plus large des hanches.</li>
          <li><strong>Longueur du corps :</strong> Mesurez de l'épaule jusqu'à l'ourlet souhaité pour les robes/tuniques.</li>
        </ol>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="font-semibold mb-2">Bébés (0-24 mois)</h3>
          <table className="w-full text-sm text-gray-700 dark:text-gray-300">
            <thead>
              <tr className="text-left"><th className="pb-2">Âge</th><th className="pb-2">Tour de poitrine (cm)</th></tr>
            </thead>
            <tbody>
              <tr><td>0-3 mois</td><td>42-46</td></tr>
              <tr><td>3-6 mois</td><td>46-50</td></tr>
              <tr><td>6-12 mois</td><td>50-54</td></tr>
              <tr><td>12-24 mois</td><td>54-58</td></tr>
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3 className="font-semibold mb-2">Enfants</h3>
          <table className="w-full text-sm text-gray-700 dark:text-gray-300">
            <thead>
              <tr className="text-left"><th className="pb-2">Taille (ans)</th><th className="pb-2">Equivalence</th></tr>
            </thead>
            <tbody>
              <tr><td>2-4 ans</td><td>92-104</td></tr>
              <tr><td>4-6 ans</td><td>104-116</td></tr>
              <tr><td>6-10 ans</td><td>116-140</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-3">Conseils pratiques</h3>
        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
          <li>Si vous hésitez entre deux tailles, prenez la taille au-dessus pour plus de confort.</li>
          <li>Consultez la fiche produit : certains articles (coupe slim, oversized) incluent des recommandations spécifiques.</li>
          <li>Pour les cadeaux, vérifiez la politique de retour si vous n\'êtes pas certain de la taille.</li>
        </ul>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-3">Besoin d'aide ?</h3>
        <p className="text-gray-700 dark:text-gray-300">Contactez notre service client avec les mesures si vous souhaitez une recommandation personnalisée.</p>
      </section>
    </div>
  )
}
