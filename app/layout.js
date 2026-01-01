import './assets/css/styles.css'

export const metadata = {
  title: 'Inmuebles a tu alcance',
  description: 'Sistema para la materia desarrollo de sistemas web',
};
 
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}