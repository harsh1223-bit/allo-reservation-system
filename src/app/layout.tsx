import "./globals.css";

export const metadata = {
  title: "Allo Reservation System",
  description: "Inventory reservation system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}