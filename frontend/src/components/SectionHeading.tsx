type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionHeading({ eyebrow, title, description, align = "left" }: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-terracotta-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl font-semibold text-forest-950 sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-forest-900/70">{description}</p>
      )}
    </div>
  );
}
