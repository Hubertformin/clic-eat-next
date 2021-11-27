import React from 'react';
import {NextSeo} from "next-seo";

export default function SeoTags({title, description = ""}) {
    return(
        <NextSeo
            title={title}
            description={description}
            openGraph={{
                url: 'https://clickeat.net',
                title: title,
                description: description,
                images: [
                    {
                        url: 'https://firebasestorage.googleapis.com/v0/b/clic-eat-app.appspot.com/o/logo%20red.png?alt=media&token=36171eba-4001-4e43-9779-3bfda9addeb8',
                        width: 800,
                        height: 600,
                        alt: 'Og Image Alt',
                    },
                ],
                site_name: 'Clic-eat',
            }}
            twitter={{
                handle: '@cliceat1',
                site: '@cliceat.net',
                cardType: 'summary_large_image',
            }}
        />
    )
}