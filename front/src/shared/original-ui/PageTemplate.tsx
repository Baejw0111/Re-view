export default function PageTemplate({
  pageName,
  children,
}: {
  pageName: string;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full px-4 md:px-6 py-4 md:py-6">
      <div className="flex items-center justify-between mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">{pageName}</h1>
      </div>
      {children}
    </div>
  );
}
