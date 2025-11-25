export default function NewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  
   return (
    <div className="overflow-hidden">
      {children}
    </div>
  );
}