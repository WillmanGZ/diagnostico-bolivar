import sectorAntiguo from '../assets/fotos/cartagena-sector-antiguo.jpg';
import murallas from '../assets/fotos/cartagena-murallas.jpg';
import castillo from '../assets/fotos/castillo-san-felipe.jpg';
import laPopa from '../assets/fotos/cartagena-la-popa.jpg';
import mompoxRio from '../assets/fotos/mompox-rio.jpg';
import mompoxIglesia from '../assets/fotos/mompox-turismo.jpg';
import playaBlanca from '../assets/fotos/playa-blanca-baru.jpg';
import palenque from '../assets/fotos/palenque.jpg';
import rioMagdalena from '../assets/fotos/rio-magdalena.jpg';

export interface Foto {
  src: ImageMetadata;
  alt: string;
  caption: string;
  autor: string;
  licencia: string;
  url: string;
}

const commons = (file: string) => `https://commons.wikimedia.org/wiki/File:${file}`;

export const fotos = {
  sectorAntiguo: {
    src: sectorAntiguo,
    alt: 'Vista panorámica de la Torre del Reloj y la Plaza de los Coches, en el centro histórico de Cartagena de Indias',
    caption: 'Torre del Reloj y Plaza de los Coches, puerta principal del centro histórico de Cartagena.',
    autor: 'Bernard Gagnon',
    licencia: 'CC BY-SA 4.0',
    url: commons('Sector_Antiguo_de_Cartagena,_Colombia_01.jpg'),
  },
  murallas: {
    src: murallas,
    alt: 'Tramo de las murallas coloniales de Cartagena de Indias frente al mar Caribe',
    caption: 'Murallas coloniales de Cartagena, Patrimonio de la Humanidad desde 1984.',
    autor: 'Bernard Gagnon',
    licencia: 'CC BY-SA 4.0',
    url: commons('City_walls_of_Cartagena_02.jpg'),
  },
  castillo: {
    src: castillo,
    alt: 'Castillo de San Felipe de Barajas sobre el cerro de San Lázaro, en Cartagena',
    caption: 'Castillo de San Felipe de Barajas, la mayor fortaleza colonial española en América.',
    autor: 'Bernard Gagnon',
    licencia: 'CC BY-SA 4.0',
    url: commons('Castillo_San_Felipe_de_Barajas,_Cartagena_07.jpg'),
  },
  laPopa: {
    src: laPopa,
    alt: 'Atardecer sobre la bahía de Cartagena y el barrio de Bocagrande visto desde el cerro de La Popa',
    caption: 'Bahía de Cartagena y Bocagrande al atardecer, vistos desde el cerro de La Popa.',
    autor: 'Norma Gòmez',
    licencia: 'CC BY 2.0',
    url: commons('Atardecer_en_Cartagena_de_Indias_desde_La_Popa..jpg'),
  },
  mompoxRio: {
    src: mompoxRio,
    alt: 'Santa Cruz de Mompox vista desde el río Magdalena',
    caption: 'Santa Cruz de Mompox desde el río Magdalena, Patrimonio de la Humanidad desde 1995.',
    autor: 'O--o',
    licencia: 'CC BY 3.0',
    url: commons('Mompox_-_Vista_dal_Rio_Magdalena.jpg'),
  },
  mompoxIglesia: {
    src: mompoxIglesia,
    alt: 'Iglesia de fachada amarilla y blanca con cúpula roja en el centro histórico de Mompox',
    caption: 'Arquitectura colonial en el centro histórico de Mompox.',
    autor: 'Alfredodh',
    licencia: 'CC BY-SA 4.0',
    url: commons('Mompox_Turismo.jpg'),
  },
  playaBlanca: {
    src: playaBlanca,
    alt: 'Playa de arena blanca y agua turquesa en la isla de Barú, frente a Cartagena',
    caption: 'Playa Blanca, en la isla de Barú, parte del archipiélago de Cartagena.',
    autor: 'Felipeortegag',
    licencia: 'CC BY-SA 4.0',
    url: commons('Playa_Blanca,_Barú.jpg'),
  },
  palenque: {
    src: palenque,
    alt: 'Monumento en bronce de un hombre con una cadena rota alzando el brazo, en San Basilio de Palenque',
    caption: 'Monumento en San Basilio de Palenque, primer pueblo libre de América.',
    autor: 'kosmel bonfante',
    licencia: 'CC BY 3.0',
    url: commons('San_basilio_de_palenque_-_panoramio_(1).jpg'),
  },
  rioMagdalena: {
    src: rioMagdalena,
    alt: 'Atardecer anaranjado sobre el río Magdalena a su paso por Bolívar',
    caption: 'El río Magdalena, eje de la región de la depresión momposina y del sur de Bolívar.',
    autor: 'Marybobadilla',
    licencia: 'CC BY-SA 4.0',
    url: commons('Atardecer_en_el_río_Magdalena.jpg'),
  },
} satisfies Record<string, Foto>;
