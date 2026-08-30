type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group rounded-2xl border border-wood-700/15 bg-cream-100 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-forest-800/10 text-forest-800 transition-colors duration-300 group-hover:bg-forest-800 group-hover:text-cream-100">
        {icon}
      </div>
      <h3 className="mt-4 font-serif text-lg font-semibold text-forest-950">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-forest-900/70">{description}</p>
    </div>
  );
}
