# La Plaza · Fuengirola

Web artesanal en HTML, CSS y JavaScript, con identidad gráfica propia y tipografías locales Manrope y Barlow Condensed. No necesita instalar dependencias.

`npm run dev` inicia la vista local en http://127.0.0.1:4321.

## Diseño y navegación

Cabecera persistente con logo y reservas en escritorio y móvil. Recorrido organizado: portada de la barra, presentación del local, carta fotográfica, bodega, galería, opiniones y contacto. Proporciones de imagen constantes, alineaciones compartidas y transiciones suaves que respetan la preferencia de movimiento reducido. Se eliminaron los collages escalonados, fotografías inclinadas y carruseles recortados.

La carta filtra platos por categoría y abre un visor de detalle. La galería permite explorar las 80 imágenes y navegar por teclado. La portada comienza con la barra 4K y permite alternar anochecer y terraza de día. Los botones utilizan acabado dorado satinado e iconos SVG. Cada una de las cinco botellas abre una ficha de exactamente 60 palabras, con su imagen, descripción y enlace a la bodega; la ficha también se abre desde la colección y la carta. Las reservas utilizan el teléfono y correo reales del restaurante, sin simular una confirmación automática.

## Imágenes 4K

81 imágenes finales de **3840 × 2160 píxeles**: 80 de la colección y la portada arquitectónica. El sitio utiliza archivos WebP 4K y carga diferida en imágenes secundarias. `image-resolution-report.json` contiene dimensiones, tamaño, huella SHA-256 y procedimiento de cada archivo.

Las imágenes originales fueron generadas con IA a 1672 × 941 a partir de referencias reales de terraza y barra. Se mejoraron localmente con **Real-ESRGAN x4plus**, obteniendo 6688 × 3764, y se prepararon a 3840 × 2160. Son imágenes con superresolución por IA; no fotografías capturadas ni generadas nativamente en 4K. Los originales y los másteres JPEG se conservan fuera del paquete web en `originals/`.

Las escenas, iluminación y presentación de platos son recreaciones editoriales. No sustituyen fotografías documentales ni garantizan cada detalle arquitectónico. La portada es una visualización arquitectónica rasterizada, no un modelo 3D interactivo. No se utilizaron fotografías de relleno ni texto de muestra.

Motor de superresolución: https://github.com/xinntao/Real-ESRGAN y su distribución oficial NCNN/Vulkan. Las licencias de las tipografías se incluyen en `dist/fonts/`.

## Fuentes

- https://www.barlaplazafuengirola.es/carta-de-comidas-y-tapas/
- https://www.barlaplazafuengirola.es/contacto-y-reservas/
- https://www.barlaplazafuengirola.es/carta-de-bebidas/
- https://www.barlaplazafuengirola.es/carta-de-vinos/
- Perfil Google Maps aportado por el usuario: referencias fotográficas del local.
- https://es.restaurantguru.com/La-Plaza-Fuengirola-2 : extractos de opiniones atribuidas a Google.

Los vinos proceden de la carta oficial; no se atribuyen a menciones no verificadas en reseñas. Precios, añadas, alérgenos y disponibilidad deben consultarse al restaurante.

## Verificación

`node verify.mjs` comprueba la colección y las referencias de imágenes del HTML. `node --check` valida los archivos JavaScript. `integrate-4k.mjs` verifica dimensiones de los 81 WebP antes de actualizar referencias. Las interacciones se revisaron en navegador en móvil, escritorio y viewport 4K.
