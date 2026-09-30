import type { ReactNode } from "react";

// ============================================
// DATOS DEL TITULAR — RELLENAR ANTES DE PUBLICAR
// Obligatorios por la LSSI (art. 10). Mientras un campo esté vacío,
// la web muestra "pendiente" en su lugar.
// ============================================
export const TITULAR = {
  nombre: "",      // Nombre y apellidos o razón social. Ej: "Javier Bosco Properties S.L."
  nif: "",         // NIF / CIF
  domicilio: "",   // Dirección completa
  registro: "",    // Solo si es sociedad: "Inscrita en el Registro Mercantil de Madrid, Tomo X, Folio Y, Hoja M-Z"
};

export const EMAIL_PUBLICO = "javierbosco@javierbosco.com";
export const EMAIL_FORMULARIO = "javierboscointerno@gmail.com";
const DOMINIO = "javierbosco.com";
const ACTUALIZADO = "30 de septiembre de 2026";

export type LegalKey = "aviso-legal" | "privacidad" | "cookies";

function v(value: string, label: string) {
  return value || `[${label} pendiente]`;
}

export const LEGAL: Record<LegalKey, { title: string; body: () => ReactNode }> = {
  "aviso-legal": {
    title: "Aviso legal",
    body: () => (
      <>
        <h3>1. Titular del sitio web</h3>
        <p>En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa de los datos del titular de {DOMINIO}:</p>
        <ul>
          <li>Titular: {v(TITULAR.nombre, "Titular")}</li>
          <li>NIF/CIF: {v(TITULAR.nif, "NIF")}</li>
          <li>Domicilio: {v(TITULAR.domicilio, "Domicilio")}</li>
          <li>Email: {EMAIL_PUBLICO}</li>
          {TITULAR.registro && <li>{TITULAR.registro}</li>}
        </ul>
        <h3>2. Objeto</h3>
        <p>Este sitio web presenta los servicios de intermediación en operaciones inmobiliarias off-market y de otros activos de alto valor de Javier Bosco Properties. La información publicada tiene carácter meramente informativo y no constituye oferta vinculante. Los activos mostrados pueden no estar disponibles y sus condiciones se confirman únicamente de forma privada.</p>
        <h3>3. Condiciones de uso</h3>
        <p>El acceso a este sitio web atribuye la condición de usuario e implica la aceptación de este aviso legal. El usuario se compromete a hacer un uso adecuado de los contenidos y a no emplearlos para actividades ilícitas o contrarias a la buena fe.</p>
        <h3>4. Propiedad intelectual e industrial</h3>
        <p>Los textos, diseño, logotipos y marca de este sitio web pertenecen a su titular o se utilizan con licencia. Queda prohibida su reproducción, distribución o transformación sin autorización expresa. Las fotografías de destinos y tipologías son imágenes de referencia utilizadas bajo la licencia de Unsplash.</p>
        <h3>5. Responsabilidad</h3>
        <p>El titular no se hace responsable de los daños derivados del uso de la información de este sitio web ni de interrupciones o errores técnicos ajenos a su control. Los enlaces a sitios de terceros se ofrecen solo a título informativo.</p>
        <h3>6. Legislación aplicable</h3>
        <p>Este aviso legal se rige por la legislación española. Para cualquier controversia, las partes se someten a los juzgados y tribunales que correspondan conforme a la normativa aplicable.</p>
      </>
    ),
  },
  privacidad: {
    title: "Política de privacidad",
    body: () => (
      <>
        <h3>1. Responsable del tratamiento</h3>
        <ul>
          <li>Responsable: {v(TITULAR.nombre, "Titular")}</li>
          <li>NIF/CIF: {v(TITULAR.nif, "NIF")}</li>
          <li>Domicilio: {v(TITULAR.domicilio, "Domicilio")}</li>
          <li>Contacto: {EMAIL_PUBLICO}</li>
        </ul>
        <h3>2. Datos que tratamos</h3>
        <p>Los que usted facilita en el formulario de contacto: nombre, email, teléfono y, si los indica, el tipo de operación, ubicación, tipo de activo, rango de inversión o dirección del activo.</p>
        <h3>3. Finalidad</h3>
        <p>Atender su solicitud, valorar si encaja con alguna operación en curso y contactarle en relación con ella. No se elaboran perfiles ni se toman decisiones automatizadas. No enviamos comunicaciones comerciales sin su consentimiento.</p>
        <h3>4. Base jurídica</h3>
        <p>Su consentimiento al enviar el formulario (art. 6.1.a RGPD) y la aplicación de medidas precontractuales a petición suya (art. 6.1.b RGPD).</p>
        <h3>5. Destinatarios</h3>
        <p>No se ceden datos a terceros salvo obligación legal. Para el envío del formulario se utiliza el servicio FormSubmit, y la recepción se gestiona mediante correo electrónico de Google (Gmail), que actúan como encargados del tratamiento y pueden implicar transferencias internacionales de datos amparadas en las garantías previstas en el RGPD (cláusulas contractuales tipo y/o el Marco de Privacidad de Datos UE-EE. UU.).</p>
        <h3>6. Conservación</h3>
        <p>Los datos se conservan mientras dure la relación o la gestión de su solicitud y, después, durante los plazos legalmente exigibles. Si no se inicia ninguna operación, se suprimen en un plazo máximo de 12 meses.</p>
        <h3>7. Sus derechos</h3>
        <p>Puede ejercer los derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad escribiendo a {EMAIL_PUBLICO}, así como retirar su consentimiento en cualquier momento. Si considera que el tratamiento no es adecuado, puede presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es).</p>
        <p className="legal-date">Última actualización: {ACTUALIZADO}.</p>
      </>
    ),
  },
  cookies: {
    title: "Política de cookies",
    body: () => (
      <>
        <h3>1. Qué utiliza este sitio web</h3>
        <p>Este sitio web no utiliza cookies de análisis, publicidad ni seguimiento, y no carga servicios de terceros que las instalen. Las tipografías y las imágenes se sirven desde el propio dominio.</p>
        <h3>2. Almacenamiento técnico</h3>
        <p>Únicamente se guarda en su navegador (almacenamiento local) el idioma que haya seleccionado, para mostrarle la web en ese idioma en futuras visitas. Es un almacenamiento estrictamente técnico solicitado por el propio usuario y está exento de consentimiento conforme al artículo 22.2 de la LSSI-CE.</p>
        <h3>3. Cómo eliminarlo</h3>
        <p>Puede borrar este dato en cualquier momento desde la configuración de su navegador (datos de sitios web / almacenamiento local).</p>
        <h3>4. Cambios</h3>
        <p>Si en el futuro se incorporan cookies no técnicas (por ejemplo, de analítica), se solicitará su consentimiento previo mediante un aviso y se actualizará esta política.</p>
        <p className="legal-date">Última actualización: {ACTUALIZADO}.</p>
      </>
    ),
  },
};
