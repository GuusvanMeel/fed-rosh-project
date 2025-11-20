export default function NewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   return (
    <div className="overflow-x-hidden">
      {children}
    </div>
  );
}