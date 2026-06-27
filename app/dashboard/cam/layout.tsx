export default function CamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {/* Layout específico para la página de cámara */}
      {children}
    </section>
  );
}