import type { Metadata } from "next";
import ObfuscatedEmail from "@/components/ObfuscatedEmail";

export const metadata: Metadata = {
  title: "Tietosuojaseloste — Marco Izaac",
};

export default function TietosuojaPage() {
  return (
    <main className="max-w-[800px] mx-auto px-gutter py-xl">
      <h1
        className="text-3xl font-semibold text-primary mb-lg"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Tietosuojaseloste
      </h1>

      <div className="space-y-lg text-on-surface-variant leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold text-primary mb-sm">Rekisterinpitäjä</h2>
          <p>
            Marco Izaac — Ad Hoc Käännöspalvelut
            <br />
            Yhteystiedot: <ObfuscatedEmail className="text-primary underline" />
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mb-sm">
            Mitä tietoja kerätään ja miksi
          </h2>
          <p>
            Kun lähetät yhteydenottolomakkeen sivustolla, keräämme nimesi, sähköpostiosoitteesi,
            valitsemasi palvelun tyypin sekä kirjoittamasi viestin. Tietoja käytetään ainoastaan
            yhteydenottoosi ja tarjouspyyntöösi vastaamiseen. Tietoja ei käytetä
            markkinointiin eikä luovuteta kolmansille osapuolille myyntitarkoituksessa.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mb-sm">Käsittelyn peruste</h2>
          <p>
            Tietojen käsittely perustuu suostumukseesi, jonka annat lähettäessäsi lomakkeen, sekä
            oikeutettuun etuun vastata sinulle esitettyyn tiedusteluun.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mb-sm">
            Tietojen käsittelijät
          </h2>
          <p>
            Yhteydenottolomakkeen viestit välitetään sähköpostiin Resend-nimisen palvelun
            (resend.com) kautta. Resend on yhdysvaltalainen palveluntarjoaja, joten viestin
            sisältämät tiedot voivat siirtyä hetkellisesti EU/ETA-alueen ulkopuolelle viestin
            toimituksen yhteydessä.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mb-sm">Säilytysaika</h2>
          <p>
            Yhteydenottoviestejä säilytetään sähköpostilaatikossa niin kauan kuin se on
            asiakassuhteen tai tiedustelun hoitamisen kannalta tarpeellista, minkä jälkeen ne
            poistetaan kohtuullisessa ajassa.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mb-sm">Evästeet ja seuranta</h2>
          <p>
            Sivusto ei käytä analytiikka- tai markkinointievästeitä eikä seuraa kävijöitä.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-primary mb-sm">Oikeutesi</h2>
          <p>
            Sinulla on oikeus tarkastaa, oikaista tai pyytää poistamaan sinusta tallennetut
            tiedot. Voit käyttää oikeuksiasi ottamalla yhteyttä osoitteeseen{" "}
            <ObfuscatedEmail className="text-primary underline" />
            . Sinulla on myös oikeus tehdä valitus tietosuojavaltuutetun toimistolle, jos katsot
            tietojasi käsitellyn lainvastaisesti.
          </p>
        </section>
      </div>

      <a href="/" className="inline-block mt-lg text-primary underline">
        ← Takaisin etusivulle
      </a>
    </main>
  );
}
