/*
  CONFIGURACIÓN MANUAL DE LA QUINIELA

  Edita este archivo para actualizar participantes, puntos de grupos, resultados, pronósticos y fechas.

  Formato en eliminatorias:
  - Sin marcador: null
  - Marcador normal: { marcador: [2, 0], pasa: null }
  - Empate donde pasa local: { marcador: [1, 1], pasa: "L" }
  - Empate donde pasa visitante: { marcador: [1, 1], pasa: "V" }

  L = pasa el equipo local
  V = pasa el equipo visitante

  La fecha y hora de última actualización se toman automáticamente
  del último commit de GitHub Pages.
*/

const CONFIG = {
  // Fase que aparece abierta por defecto en el desglose de cada jugador.
  // Opciones: "grupos", "d16", "d8", "d4", "semi", "final".
  "faseAbierta": "d16",

  "reglas": {
    "exacto": 3,
    "resultado": 1,
    "error": 0
  },
  "participantes": [
    {
      "nombre": "Jose Galicia",
      "grupos": 58
    },
    {
      "nombre": "Estebana de la Torre",
      "grupos": 50
    },
    {
      "nombre": "Rubén Medina",
      "grupos": 49
    },
    {
      "nombre": "Christian Zugaide",
      "grupos": 47
    },
    {
      "nombre": "Eduardo Sandoval",
      "grupos": 48
    },
    {
      "nombre": "Leonardo Ledesma",
      "grupos": 46
    },
    {
      "nombre": "Erik Degante",
      "grupos": 42
    },
    {
      "nombre": "Ricardo Cortés",
      "grupos": 42
    },
    {
      "nombre": "Mario Morales",
      "grupos": 36
    }
  ],
  "resultados": {
    "d16": {
      "p01": null,
      "p02": null,
      "p03": null,
      "p04": null,
      "p05": null,
      "p06": null,
      "p07": null,
      "p08": null,
      "p09": null,
      "p10": null,
      "p11": null,
      "p12": null,
      "p13": null,
      "p14": null,
      "p15": null,
      "p16": null
    },
    "d8": {
      "p01": null,
      "p02": null,
      "p03": null,
      "p04": null,
      "p05": null,
      "p06": null,
      "p07": null,
      "p08": null
    },
    "d4": {
      "p01": null,
      "p02": null,
      "p03": null,
      "p04": null
    },
    "semi": {
      "p01": null,
      "p02": null
    },
    "final": {
      "p01": null,
      "p02": null
    }
  },
  "pronosticos": [
    {
      "d16": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null,
        "p09": null,
        "p10": null,
        "p11": null,
        "p12": null,
        "p13": null,
        "p14": null,
        "p15": null,
        "p16": null
      },
      "d8": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null
      },
      "d4": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null
      },
      "semi": {
        "p01": null,
        "p02": null
      },
      "final": {
        "p01": null,
        "p02": null
      }
    },
    {
      "d16": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null,
        "p09": null,
        "p10": null,
        "p11": null,
        "p12": null,
        "p13": null,
        "p14": null,
        "p15": null,
        "p16": null
      },
      "d8": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null
      },
      "d4": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null
      },
      "semi": {
        "p01": null,
        "p02": null
      },
      "final": {
        "p01": null,
        "p02": null
      }
    },
    {
      "d16": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null,
        "p09": null,
        "p10": null,
        "p11": null,
        "p12": null,
        "p13": null,
        "p14": null,
        "p15": null,
        "p16": null
      },
      "d8": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null
      },
      "d4": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null
      },
      "semi": {
        "p01": null,
        "p02": null
      },
      "final": {
        "p01": null,
        "p02": null
      }
    },
    {
      "d16": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null,
        "p09": null,
        "p10": null,
        "p11": null,
        "p12": null,
        "p13": null,
        "p14": null,
        "p15": null,
        "p16": null
      },
      "d8": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null
      },
      "d4": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null
      },
      "semi": {
        "p01": null,
        "p02": null
      },
      "final": {
        "p01": null,
        "p02": null
      }
    },
    {
      "d16": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null,
        "p09": null,
        "p10": null,
        "p11": null,
        "p12": null,
        "p13": null,
        "p14": null,
        "p15": null,
        "p16": null
      },
      "d8": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null
      },
      "d4": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null
      },
      "semi": {
        "p01": null,
        "p02": null
      },
      "final": {
        "p01": null,
        "p02": null
      }
    },
    {
      "d16": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null,
        "p09": null,
        "p10": null,
        "p11": null,
        "p12": null,
        "p13": null,
        "p14": null,
        "p15": null,
        "p16": null
      },
      "d8": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null
      },
      "d4": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null
      },
      "semi": {
        "p01": null,
        "p02": null
      },
      "final": {
        "p01": null,
        "p02": null
      }
    },
    {
      "d16": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null,
        "p09": null,
        "p10": null,
        "p11": null,
        "p12": null,
        "p13": null,
        "p14": null,
        "p15": null,
        "p16": null
      },
      "d8": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null
      },
      "d4": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null
      },
      "semi": {
        "p01": null,
        "p02": null
      },
      "final": {
        "p01": null,
        "p02": null
      }
    },
    {
      "d16": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null,
        "p09": null,
        "p10": null,
        "p11": null,
        "p12": null,
        "p13": null,
        "p14": null,
        "p15": null,
        "p16": null
      },
      "d8": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null
      },
      "d4": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null
      },
      "semi": {
        "p01": null,
        "p02": null
      },
      "final": {
        "p01": null,
        "p02": null
      }
    },
    {
      "d16": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null,
        "p09": null,
        "p10": null,
        "p11": null,
        "p12": null,
        "p13": null,
        "p14": null,
        "p15": null,
        "p16": null
      },
      "d8": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null,
        "p05": null,
        "p06": null,
        "p07": null,
        "p08": null
      },
      "d4": {
        "p01": null,
        "p02": null,
        "p03": null,
        "p04": null
      },
      "semi": {
        "p01": null,
        "p02": null
      },
      "final": {
        "p01": null,
        "p02": null
      }
    }
  ],
  "partidos": {
    "d16": {
      "p01": {
        "local": "Alemania",
        "flagL": "de",
        "visita": "Paraguay",
        "flagV": "py",
        "fecha": "29/06 — Boston"
      },
      "p02": {
        "local": "Francia",
        "flagL": "fr",
        "visita": "Suecia",
        "flagV": "se",
        "fecha": "30/06 — Nueva York/Nueva Jersey"
      },
      "p03": {
        "local": "Sudáfrica",
        "flagL": "za",
        "visita": "Canadá",
        "flagV": "ca",
        "fecha": "28/06 — Los Ángeles"
      },
      "p04": {
        "local": "Países Bajos",
        "flagL": "nl",
        "visita": "Marruecos",
        "flagV": "ma",
        "fecha": "29/06 — Monterrey"
      },
      "p05": {
        "local": "Portugal",
        "flagL": "pt",
        "visita": "Croacia",
        "flagV": "hr",
        "fecha": "02/07 — Toronto"
      },
      "p06": {
        "local": "España",
        "flagL": "es",
        "visita": "Austria",
        "flagV": "at",
        "fecha": "02/07 — Los Ángeles"
      },
      "p07": {
        "local": "Estados Unidos",
        "flagL": "us",
        "visita": "Bosnia y Herzegovina",
        "flagV": "ba",
        "fecha": "01/07 — San Francisco"
      },
      "p08": {
        "local": "Bélgica",
        "flagL": "be",
        "visita": "Senegal",
        "flagV": "sn",
        "fecha": "01/07 — Seattle"
      },
      "p09": {
        "local": "Brasil",
        "flagL": "br",
        "visita": "Japón",
        "flagV": "jp",
        "fecha": "29/06 — Houston"
      },
      "p10": {
        "local": "Costa de Marfil",
        "flagL": "ci",
        "visita": "Noruega",
        "flagV": "no",
        "fecha": "30/06 — Dallas"
      },
      "p11": {
        "local": "México",
        "flagL": "mx",
        "visita": "Ecuador",
        "flagV": "ec",
        "fecha": "30/06 — Ciudad de México"
      },
      "p12": {
        "local": "Inglaterra",
        "flagL": "gb-eng",
        "visita": "R. D. del Congo",
        "flagV": "cd",
        "fecha": "01/07 — Atlanta"
      },
      "p13": {
        "local": "Argentina",
        "flagL": "ar",
        "visita": "Cabo Verde",
        "flagV": "cv",
        "fecha": "03/07 — Miami"
      },
      "p14": {
        "local": "Australia",
        "flagL": "au",
        "visita": "Egipto",
        "flagV": "eg",
        "fecha": "03/07 — Dallas"
      },
      "p15": {
        "local": "Suiza",
        "flagL": "ch",
        "visita": "Argelia",
        "flagV": "dz",
        "fecha": "02/07 — Vancouver"
      },
      "p16": {
        "local": "Colombia",
        "flagL": "co",
        "visita": "Ghana",
        "flagV": "gh",
        "fecha": "03/07 — Kansas City"
      }
    },
    "d8": {
      "p01": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": ""
      },
      "p02": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": ""
      },
      "p03": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": ""
      },
      "p04": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": ""
      },
      "p05": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": ""
      },
      "p06": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": ""
      },
      "p07": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": ""
      },
      "p08": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": ""
      }
    },
    "d4": {
      "p01": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": ""
      },
      "p02": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": ""
      },
      "p03": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": ""
      },
      "p04": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": ""
      }
    },
    "semi": {
      "p01": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": ""
      },
      "p02": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": ""
      }
    },
    "final": {
      "p01": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": "",
        "nota": "Gran final"
      },
      "p02": {
        "local": "Por definir",
        "flagL": "",
        "visita": "Por definir",
        "flagV": "",
        "fecha": "",
        "nota": "Partido por tercer lugar"
      }
    }
  }
};
