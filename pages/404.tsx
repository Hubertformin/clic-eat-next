import React from 'react';
import Toolbar from "../components/toolbar";
import SeoTags from "../components/seo";

function NotFoundComp() {
    return(
        <>
            <style jsx>{`
             .error-text {
                font-size: 90px;
            }

            @media (min-width: 768px) {
                .error-text {
                   font-size: 150px;
                 }
            }

            `}</style>
            <SeoTags title="La page que vous recherchez n'a pas été trouvée"></SeoTags>
            <Toolbar />
            <div className="w-screen pt-32 px-8 flex justify-center align-item-center flex-col content-center flex-wrap">
                <p className="error-text mb-0">404</p>
                <p className="text-lg">La page que vous recherchez n'a pas été trouvée. J'ai peut-être été supprimé ou retiré par les responsables du site</p>
            </div>

            <div className="absolute w-screen bottom-0 mb-6 text-center font-sans text-xl">
                <span className="opacity-50">Retournez à </span>
                <a className="border-b" href="/">la page d'accueil</a>
            </div>
        </>
    )
}

export default NotFoundComp;
