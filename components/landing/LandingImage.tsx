"use client";

import { useEffect, useRef, useState } from "react";

// Affiche l'image ; si le fichier n'est pas encore déposé dans public/, un
// dégradé aux couleurs de la charte prend sa place pour ne pas casser la mise
// en page (et éviter l'icône d'image cassée).
export default function LandingImage({
  src,
  alt,
  className = "",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  /** Images visibles d'emblée : chargées sans attendre le défilement. */
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Le chargement échoue avant l'hydratation : onError n'est jamais reçu, d'où
  // cette vérification au montage.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-ocean-soft via-white to-sun-soft ${className}`}
      >
        <span className="px-3 text-center text-xs font-semibold text-ocean/50">
          {alt}
        </span>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
