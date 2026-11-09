# La Plaza · Fuengirola

Sitio artesanal sin plantilla, HTML/CSS/JavaScript. No requiere instalar dependencias.

## Vista local

`npm run dev` sirve el sitio en http://127.0.0.1:4321.

## Contenido y funciones

Carta oficial seleccionada sin precios inventados, reservas por teléfono/correo, ubicación Google Maps, galería filtrable y navegación de imágenes por teclado, cambio de luz en portada, animaciones adaptadas a movimiento reducido y diseño móvil.

Las imágenes son recreaciones con IA basadas en referencias reales de la terraza y barra del restaurante. Las personas, escenas e iluminación se recrean; el emplatado puede variar. No son fotografías documentales. Las referencias no permiten garantizar cada detalle arquitectónico.

## Resolución

Se solicitaron imágenes 4K al generador integrado; los archivos recibidos son de 1672×941 píxeles. No se presentan como 4K nativo. El sitio es adaptable a pantallas 4K, pero esto no aumenta la resolución de las fotografías. `image-resolution-report.json` registra las dimensiones verificadas. `originals/` conserva los PNG antes de compresión web.

## Fuentes

- https://www.barlaplazafuengirola.es/carta-de-comidas-y-tapas/
- https://www.barlaplazafuengirola.es/contacto-y-reservas/
- https://www.barlaplazafuengirola.es/carta-de-bebidas/
- Perfil Google Maps aportado por el usuario (referencias fotográficas)
- https://es.restaurantguru.com/La-Plaza-Fuengirola-2 (extractos de reseñas)

No existe sistema de reservas en servidor: la llamada o solicitud por correo requiere confirmación del restaurante. No se ha atribuido WhatsApp al teléfono fijo.
