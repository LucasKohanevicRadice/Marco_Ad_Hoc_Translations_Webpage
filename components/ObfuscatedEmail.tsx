"use client";

import { useEffect, useState } from "react";

/**
 * Näyttää sähköpostiosoitteen vasta selaimessa, jotta se ei ole palvelimen
 * palauttamassa HTML:ssä. Osoitteita keräävät botit lukevat tyypillisesti vain
 * HTML:n suorittamatta JavaScriptiä.
 */
export default function ObfuscatedEmail({ className }: { className?: string }) {
  const [address, setAddress] = useState("");

  useEffect(() => {
    setAddress(process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "");
  }, []);

  if (!address) {
    return <span className={className}>…</span>;
  }

  return (
    <a href={`mailto:${address}`} className={className}>
      {address}
    </a>
  );
}
