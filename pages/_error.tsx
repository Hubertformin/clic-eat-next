import React from 'react';
import Toolbar from "../components/toolbar";
import SeoTags from "../components/seo";


function ErrorPage() {
    return(
        <>
            <style jsx>{`
             .error-text {
                font-size: 70px;
            }

            @media (min-width: 768px) {
                .error-text {
                   font-size: 90px;
                 }
            }

            `}</style>
            <SeoTags title="La page que vous recherchez n'a pas été trouvée"></SeoTags>
            <Toolbar />
            <div className="w-screen pt-16 flex justify-center align-item-center flex-col content-center flex-wrap">
                <p className="error-text mb-0">Opps!</p>
                <p className="text-lg">
                    Une erreur s'est produite lors du chargement du site. Veuillez vous assurer que vous disposez d'une bonne connexion Internet.
                    Si le problème persiste, <a href="mailto:cliceat01@gmail.com">contactez l'administrateur</a>
                </p>
            </div>

            <div className="absolute w-screen bottom-0 mb-6 text-center font-sans text-xl">
                <span className="opacity-50">Retournez à </span>
                <a className="border-b" href="/">la page d'accueil</a>
            </div>
        </>
    )
}

export default ErrorPage;
